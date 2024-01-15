namespace colibri.core.io {

    export class HTTPServerFileStorageExtension extends FileStorageExtension {

        constructor() {
            super("http-server");
        }

        createStorage(): IFileStorage {

            return new HTTPServerFileStorage();
        }
    }
}