namespace colibri.core {

    export abstract class ContentTypeResolver implements IContentTypeResolver {
        private _id: string;

        constructor(id: string) {
            this._id = id;
        }

        getId() {
            return this._id;
        }

        abstract computeContentType(file: io.FilePath): Promise<string>;
    }

}