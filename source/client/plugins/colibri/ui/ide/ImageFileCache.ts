/// <reference path="../../core/io/SyncFileContentCache.ts" />

namespace colibri.ui.ide {

    export class ImageFileCache extends core.io.SyncFileContentCache<FileImage> {

        constructor() {
            super(file => new FileImage(file));
        }
    }
}