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

        static isAtlasType(type: string) {
            return ATLAS_TYPES.has(type);
        }

        static async getAllPacks() {

            const files = await ide.FileUtils.getFilesWithContentType(contentTypes.CONTENT_TYPE_ASSET_PACK);

            const packs: AssetPack[] = [];

            for (const file of files) {
                const pack = await AssetPack.createFromFile(file);
                packs.push(pack);
            }

            return packs;
        }

        static getFileFromPackUrl(url: string): io.FilePath {

            const url2 = ide.FileUtils.getRoot().getName() + "/" + url;

            return ide.FileUtils.getFileFromPath(url2);
        }

        static getFilePackUrl(file: io.FilePath) {

            if (file.getParent()) {
                
                return `${this.getFilePackUrl(file.getParent())}${file.getName()}${file.isFolder() ? "/" : ""}`;
            }

            return "";
        }

        static getFilePackUrlWithNewExtension(file: io.FilePath, ext : string) {

            const url = this.getFilePackUrl(file.getParent());

            return `${url}${file.getNameWithoutExtension()}.${ext}`;
        }

        static getFileStringFromPackUrl(url: string): string {

            const file = this.getFileFromPackUrl(url);

            if (!file) {

                return null;
            }
            
            const str = ide.FileUtils.getFileString(file);

            return str;
        }

        static getFileJSONFromPackUrl(url: string): any {

            const str = this.getFileStringFromPackUrl(url);

            return JSON.parse(str);
        }

        static getFileXMLFromPackUrl(url: string): Document {

            const str = this.getFileStringFromPackUrl(url);
            const parser = new DOMParser();

            return parser.parseFromString(str, "text/xml");
        }

        static getImageFromPackUrl(url: string): colibri.ui.ide.FileImage {

            const file = this.getFileFromPackUrl(url);

            if (file) {
                return ide.Workbench.getWorkbench().getFileImage(file);
            }

            return null;
        }

    }
}