/// <reference path="./ContentTypeImporter.ts" />

namespace phasereditor2d.pack.ui.importers {

    import io = colibri.core.io;
    import ide = colibri.ui.ide;

    export class BaseAtlasImporter extends ContentTypeImporter {

        acceptFile(file: io.FilePath): boolean {

            const contentType = ide.Workbench.getWorkbench().getContentTypeRegistry().getCachedContentType(file);

            return contentType === this.getContentType();
        }

        createItemData(pack: core.AssetPack, file: io.FilePath) {

            let textureURL: string;

            if (file.getNameWithoutExtension().endsWith(".png")) {

                textureURL = io.FilePath.join(pack.getUrlFromAssetFile(file.getParent()), file.getNameWithoutExtension());

            } else {

                textureURL = core.AssetPackUtils.getFilePackUrlWithNewExtension(pack, file, "png");
            }

            const altTextureFile = file.getParent().getFile(file.getName() + ".png");

            if (altTextureFile) {

                textureURL = pack.getUrlFromAssetFile(altTextureFile);
            }

            return {
                atlasURL: pack.getUrlFromAssetFile(file),
                textureURL: textureURL
            };
        }
    }
}