/// <reference path="./ImageFrameContainerAssetPackItem.ts" />

namespace phasereditor2d.pack.core {

    import io = colibri.core.io;

    export abstract class BaseAtlasAssetPackItem extends ImageFrameContainerAssetPackItem {

        computeUsedFiles(files: Set<io.FilePath>) {

            super.computeUsedFiles(files);

            this.addFilesFromDataKey(files, "atlasURL", "textureURL", "normalMap");
        }
    }
}