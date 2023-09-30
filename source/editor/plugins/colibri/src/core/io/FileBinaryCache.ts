namespace colibri.core.io {

    export class FileBinaryCache extends FileContentCache<ArrayBuffer> {

        constructor(storage: IFileStorage) {
            super(

                file => storage.getFileBinary(file),

                (file, content) => {
                    throw new Error("Not implemented yet.");
                }
            );
        }
    }
}