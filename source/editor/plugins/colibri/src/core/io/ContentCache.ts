namespace colibri.core.io {

    export declare type GetObjectContent<TObject, TContent> = (obj: TObject, force?: boolean) => Promise<TContent>;

    export declare type SetObjectContent<TObject, TContent> = (obj: TObject, content: TContent) => Promise<void>;

    export interface IContentCacheMap<T> {

        has(key: string): boolean;

        delete(key: string): void;

        set(key: string, value: ContentEntry<T>): void;

        get(key: string): ContentEntry<T>;
    }

    export abstract class ContentCache<TObject, TContent> {

        private _backendGetContent: GetObjectContent<TObject, TContent>;
        private _backendSetContent: SetObjectContent<TObject, TContent>;
        private _map: IContentCacheMap<TContent>;
        private _preloadMap: Map<string, Promise<ui.controls.PreloadResult>>;

        constructor(getContent: GetObjectContent<TObject, TContent>, setContent?: SetObjectContent<TObject, TContent>) {

            this._backendGetContent = getContent;
            this._backendSetContent = setContent;

            this.reset();
        }

        reset() {

            this._map = new Map();
            this._preloadMap = new Map();
        }

        protected abstract computeObjectHash(obj: TObject): string;

        protected abstract computeObjectKey(obj: TObject): string;

        preload(object: TObject, force = false): Promise<ui.controls.PreloadResult> {

            const objKey = this.computeObjectKey(object);

            if (this._preloadMap.has(objKey)) {

                return this._preloadMap.get(objKey);
            }

            const entry = this._map.get(objKey);

            const currentHash = this.computeObjectHash(object);

            if (entry) {

                if (!force && entry.contentHash === currentHash) {

                    return ui.controls.Controls.resolveNothingLoaded();
                }

                const promise2 = this._backendGetContent(object, force)

                    .then((content) => {

                        this._preloadMap.delete(objKey);

                        entry.contentHash = this.computeObjectHash(object);
                        entry.content = content;

                        return Promise.resolve(ui.controls.PreloadResult.RESOURCES_LOADED);
                    });

                this._preloadMap.set(objKey, promise2);

                return promise2;
            }

            const promise = this._backendGetContent(object, force)

                .then((content) => {

                    this._preloadMap.delete(objKey);

                    this._map.set(objKey, new ContentEntry(content, currentHash));

                    return ui.controls.PreloadResult.RESOURCES_LOADED;
                });

            this._preloadMap.set(objKey, promise);

            return promise;
        }

        getContent(obj: TObject) {

            const objKey = this.computeObjectKey(obj);

            const entry = this._map.get(objKey);

            return entry ? entry.content : null;
        }

        async setContent(object: TObject, content: TContent): Promise<void> {

            const objectKey = this.computeObjectKey(object);

            let entry = this._map.get(objectKey);

            const currentHash = this.computeObjectHash(object);

            if (entry) {

                entry.content = content;

            } else {

                this._map.set(objectKey, entry = new ContentEntry(content, currentHash));
            }

            if (this._backendSetContent) {

                await this._backendSetContent(object, content);
            }

            entry.contentHash = currentHash;
        }

        hasObject(object: TObject) {

            const key = this.computeObjectKey(object);

            return this._map.has(key);
        }
    }

    export class ContentEntry<T> {
        constructor(
            public content: T,
            public contentHash: string
        ) {
        }
    }
}