namespace colibri.core.io {

    export class HTTPServerFileStorageExtension extends FileStorageExtension {

        constructor() {
            super("HttpServerFileStorage");
        }

        createStorage(): IFileStorage {

            return new HTTPServerFileStorage();
        }
    }
}