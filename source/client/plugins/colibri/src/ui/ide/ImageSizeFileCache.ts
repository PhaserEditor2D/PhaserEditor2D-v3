/// <reference path="../../core/io/SyncFileContentCache.ts" />

namespace colibri.ui.ide {

    export class ImageSizeFileCache extends core.io.FileContentCache<core.io.ImageSize> {

        constructor() {
            super(
                file =>
                    ui.ide.Workbench.getWorkbench().getFileStorage().getImageSize(file)
            );
        }
    }
}