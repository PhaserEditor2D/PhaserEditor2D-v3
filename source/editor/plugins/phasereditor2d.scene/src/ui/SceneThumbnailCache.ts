/// <reference path="./ThumbnailCache.ts"/>

namespace phasereditor2d.scene.ui {

    import controls = colibri.ui.controls;
    import core = colibri.core;

    const localForage = window["localforage"] as LocalForage;

    export class SceneThumbnailCache extends ThumbnailCache<core.io.FilePath> {

        static _instance: SceneThumbnailCache;

        static getInstance() {

            if (!this._instance) {

                this._instance = new SceneThumbnailCache();
            }

            return this._instance;
        }

        private constructor() {
            super("phasereditor2d.scene.ui.SceneThumbnailCache");
        }

        createObjectImage(obj: core.io.FilePath): SceneThumbnailImage {

            return new SceneThumbnailImage(obj);
        }

        protected computeObjectHash(obj: core.io.FilePath): string {

            return obj.getModTime().toString();
        }

        protected computeObjectKey(obj: core.io.FilePath): string {

            return obj.getFullName();
        }
    }
}