/// <reference path="./BaseAtlasAssetPackItem.ts" />

namespace phasereditor2d.pack.core {

    import io = colibri.core.io;

    export class AsepriteAssetPackItem extends AssetPackItem {

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        computeUsedFiles(files: Set<io.FilePath>) {

            super.computeUsedFiles(files);

            this.addFilesFromDataKey(files, "atlasURL", "textureURL", "normalMap");
        }
    }
}