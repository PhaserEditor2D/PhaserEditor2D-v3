/// <reference path="./io/FileContentCache.ts" />

namespace colibri.core {

    export class ContentTypeFileCache extends io.FileContentCache<string> {

        constructor(registry: ContentTypeRegistry) {
            super(async (file) => {

                for (const resolver of registry.getResolvers()) {

                    try {

                        const ct = await resolver.computeContentType(file);

                        if (ct !== CONTENT_TYPE_ANY) {
                            return ct;
                        }

                    } catch (e) {
                        // nothing
                    }
                }

                return CONTENT_TYPE_ANY;
            });
        }
    }
}