namespace colibri.core.io {

    export class FileStringCache extends FileContentCache<string> {

        constructor(storage: IFileStorage) {
            super(

                file => storage.getFileString(file),

                (file, content) => storage.setFileString(file, content)

            );
        }
    }
}