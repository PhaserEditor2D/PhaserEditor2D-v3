/// <reference path="../Extension.ts" />

namespace colibri.core {

    export class ContentTypeExtension extends Extension {

        static POINT_ID = "colibri.ContentTypeExtension";

        private _resolvers: core.IContentTypeResolver[];

        constructor(resolvers: core.IContentTypeResolver[], priority: number = 10) {
            super(ContentTypeExtension.POINT_ID, priority);

            this._resolvers = resolvers;
        }

        getResolvers() {
            return this._resolvers;
        }
    }
}