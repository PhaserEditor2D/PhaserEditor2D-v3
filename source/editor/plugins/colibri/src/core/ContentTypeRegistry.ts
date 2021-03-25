/// <reference path="./io/FileContentCache.ts" />

namespace colibri.core {

    export class ContentTypeRegistry {

        private _resolvers: IContentTypeResolver[];
        private _cache: ContentTypeFileCache;

        constructor() {

            this._resolvers = [];
            this._cache = new ContentTypeFileCache(this);
        }

        resetCache() {

            this._cache.reset();
        }

        registerResolver(resolver: IContentTypeResolver) {

            this._resolvers.push(resolver);
        }

        getResolvers() {

            return this._resolvers;
        }

        getCachedContentType(file: io.FilePath) {

            return this._cache.getContent(file);
        }

        async preloadAndGetContentType(file: io.FilePath) {

            await this.preload(file);

            return this.getCachedContentType(file);
        }

        async preload(file: io.FilePath): Promise<ui.controls.PreloadResult> {

            return this._cache.preload(file);
        }
    }
}