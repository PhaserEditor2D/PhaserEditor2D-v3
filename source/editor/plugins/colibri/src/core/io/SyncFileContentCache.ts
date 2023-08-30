namespace colibri.core.io {

    export declare type SyncFileContentBuilder<T> = (file: FilePath) => T;

    export class SyncFileContentCache<T> {

        private _getContent: SyncFileContentBuilder<T>;

        private _map: Map<string, ContentEntry<T>>;

        constructor(builder: SyncFileContentBuilder<T>) {

            this._getContent = builder;

            this.reset();
        }

        reset() {
            this._map = new Map();
        }

        getContent(file: FilePath): T {

            const filename = file.getFullName();

            const entry = this._map.get(filename);

            const fileModTime = file.getModTime().toString();

            if (entry) {

                if (entry.contentHash === fileModTime) {

                    return entry.content;
                }

                const content2 = this._getContent(file);

                entry.contentHash = fileModTime;
                entry.content = content2;

                return content2;
            }

            const content = this._getContent(file);

            this._map.set(filename, new ContentEntry(content, fileModTime));

            return content;
        }

        hasFile(file: FilePath) {
            return this._map.has(file.getFullName());
        }
    }
}