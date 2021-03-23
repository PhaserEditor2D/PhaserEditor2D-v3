namespace colibri.core {

    export const CONTENT_TYPE_PUBLIC_ROOT = "colibri.core.PublicRootContentType";

    export class PublicRootContentTypeResolver extends ContentTypeResolver {

        static ID = "colibri.core.PublicRootContentTypeResolver";

        constructor() {
            super(PublicRootContentTypeResolver.ID);
        }

        async computeContentType(file: io.FilePath): Promise<string> {

            return file.getName() === "publicroot" ? core.CONTENT_TYPE_PUBLIC_ROOT : core.CONTENT_TYPE_ANY;
        }
    }
}