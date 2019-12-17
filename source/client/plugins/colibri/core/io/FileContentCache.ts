namespace colibri.core.io {

    export declare type GetFileContent<T> = (file: FilePath) => Promise<T>;

    export declare type SetFileContent<T> = (file: FilePath, content: T) => Promise<void>;

    export class FileContentCache<T> {

        private _backendGetContent: GetFileContent<T>;
        private _backendSetContent: SetFileContent<T>;
        private _map: Map<string, ContentEntry<T>>;
        private _preloadMap : Map<string, Promise<ui.controls.PreloadResult>>;

        constructor(getContent: GetFileContent<T>, setContent?: SetFileContent<T>) {

            this._backendGetContent = getContent;
            this._backendSetContent = setContent;

            this.reset();
        }

        reset() {

            this._map = new Map();
            this._preloadMap = new Map();
        }

        preload(file: FilePath): Promise<ui.controls.PreloadResult> {

            const filename = file.getFullName();

            if (this._preloadMap.has(filename)) {
                return this._preloadMap.get(filename);
            }

            const entry = this._map.get(filename);

            if (entry) {

                if (entry.modTime === file.getModTime()) {
                    return ui.controls.Controls.resolveNothingLoaded();
                }

                const promise = this._backendGetContent(file)

                    .then((content) => {

                        this._preloadMap.delete(filename);

                        entry.modTime = file.getModTime();
                        entry.content = content;

                        return Promise.resolve(ui.controls.PreloadResult.RESOURCES_LOADED);
                    });

                this._preloadMap.set(filename, promise);

                return promise;
            }

            const promise = this._backendGetContent(file)

                .then((content) => {

                    this._preloadMap.delete(filename);

                    this._map.set(filename, new ContentEntry(content, file.getModTime()));

                    return ui.controls.PreloadResult.RESOURCES_LOADED;
                });

            this._preloadMap.set(filename, promise);

            return promise;
        }

        getContent(file: FilePath) {

            const entry = this._map.get(file.getFullName());

            return entry ? entry.content : null;

        }

        async setContent(file: FilePath, content: T): Promise<void> {

            if (this._backendSetContent) {
                await this._backendSetContent(file, content);
            }

            const name = file.getFullName();
            const modTime = file.getModTime();

            let entry = this._map.get(name);

            if (entry) {

                entry.content = content;
                entry.modTime = modTime;

            } else {
                this._map.set(name, entry = new ContentEntry(content, modTime));
            }
        }

        hasFile(file: FilePath) {
            return this._map.has(file.getFullName());
        }
    }

    export class ContentEntry<T> {
        constructor(
            public content: T,
            public modTime: number
        ) {
        }
    }

}