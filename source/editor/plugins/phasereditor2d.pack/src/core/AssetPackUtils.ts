namespace phasereditor2d.pack.core {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import io = colibri.core.io;

    const ATLAS_TYPES = new Set([
        MULTI_ATLAS_TYPE,
        ATLAS_TYPE,
        UNITY_ATLAS_TYPE,
        ATLAS_XML_TYPE,
    ]);

    export class AssetPackUtils {

        static distinct(packs: AssetPack[]) {

            return [...new Set(packs)].sort((a, b) => {

                return ide.FileUtils.compareFiles(a.getFile(), b.getFile());
            });
        }

        static isAtlasType(type: string) {

            return ATLAS_TYPES.has(type);
        }

        static isImageFrameOrImage(obj: any) {

            return obj instanceof core.AssetPackImageFrame || obj instanceof core.ImageAssetPackItem;
        }

        static async getAllPacks() {

            const files = await ide.FileUtils.getFilesWithContentType(contentTypes.CONTENT_TYPE_ASSET_PACK);

            const packs: AssetPack[] = [];

            for (const file of files) {

                const pack = await AssetPack.createFromFile(file);

                if (pack) {

                    packs.push(pack);
                }
            }

            return packs;
        }

        static getUrlFromAssetFile(packOrFolder: AssetPack | io.FilePath, file: io.FilePath) {

            const packFolder = packOrFolder instanceof AssetPack ? packOrFolder.getFile().getParent() : packOrFolder;

            const root = ide.FileUtils.getPublicRoot(packFolder);
            const rootPath = root.getFullName();
            const filePath = file.getFullName();

            if (filePath.startsWith(rootPath)) {

                return filePath.substring(rootPath.length + 1);
            }

            return file.getProjectRelativeName();
        }

        static getFileFromPackUrl(packOrFolder: AssetPack | io.FilePath, url: string): io.FilePath {

            const folder = packOrFolder instanceof AssetPack ? packOrFolder.getFile().getParent() : packOrFolder;

            const pubRoot = ide.FileUtils.getPublicRoot(folder);

            return ide.FileUtils.getFileFromPath(url, pubRoot);
        }

        static getFilePackUrlWithNewExtension(pack: core.AssetPack, file: io.FilePath, ext: string) {

            const url = pack.getUrlFromAssetFile(file.getParent());

            return `${url}/${file.getNameWithoutExtension()}.${ext}`;
        }

        static getFileStringFromPackUrl(packOrFolder: AssetPack | io.FilePath, url: string): string {

            const file = this.getFileFromPackUrl(packOrFolder, url);

            if (!file) {

                return null;
            }

            const str = ide.FileUtils.getFileString(file);

            return str;
        }

        static getFileJSONFromPackUrl(packOrFolder: AssetPack | io.FilePath, url: string): any {

            const str = this.getFileStringFromPackUrl(packOrFolder, url);

            return JSON.parse(str);
        }

        static getFileXMLFromPackUrl(packOrFolder: AssetPack | io.FilePath, url: string): Document {

            const str = this.getFileStringFromPackUrl(packOrFolder, url);

            const parser = new DOMParser();

            return parser.parseFromString(str, "text/xml");
        }

        static getImageFromPackUrl(packOrFolder: AssetPack | io.FilePath, url: string): colibri.ui.ide.FileImage {

            const file = this.getFileFromPackUrl(packOrFolder, url);

            if (file) {

                return ide.Workbench.getWorkbench().getFileImage(file);
            }

            return null;
        }
    }
}