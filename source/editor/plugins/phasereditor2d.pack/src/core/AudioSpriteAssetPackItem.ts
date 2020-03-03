/// <reference path="./AssetPackItem.ts" />

namespace phasereditor2d.pack.core {

    import io = colibri.core.io;

    export class AudioSpriteAssetPackItem extends AssetPackItem {

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        computeUsedFiles(files: Set<io.FilePath>) {

            super.computeUsedFiles(files);

            this.addFilesFromDataKey(files, "jsonURL", "audioURL");
        }
    }
}