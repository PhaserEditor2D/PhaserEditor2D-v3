namespace colibri.core.io {

    export abstract class FileStorageExtension extends Extension {

        static POINT_ID = "colibri.core.io.FileStorageExtension";

        private _storageId: string;

        constructor(storageId: string, priority = 10) {
            super(FileStorageExtension.POINT_ID, priority);

            this._storageId = storageId;
        }

        getStorageId() {

            return this._storageId;
        }
        
        abstract createStorage(): IFileStorage;
    }
}