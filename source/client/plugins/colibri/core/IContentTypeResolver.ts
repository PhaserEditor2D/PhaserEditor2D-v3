namespace colibri.core {

    export const CONTENT_TYPE_ANY = "any";

    export interface IContentTypeResolver {

        getId(): string;

        computeContentType(file: io.FilePath): Promise<string>;
    }
}