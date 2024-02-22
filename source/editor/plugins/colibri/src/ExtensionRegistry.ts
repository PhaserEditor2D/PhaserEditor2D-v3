namespace colibri {

    export class ExtensionRegistry {

        private _map: Map<string, Extension[]>;

        constructor() {
            this._map = new Map();
        }

        addExtension(...extensions: Extension[]) {

            const points = new Set<string>();

            for (const ext of extensions) {

                const point = ext.getExtensionPoint();

                let list = this._map.get(point);

                if (!list) {
                    this._map.set(point, list = []);
                }

                list.push(ext);
            }

            for (const point of points) {

                const list = this._map.get(point);

                list.sort((a, b) => a.getPriority() - b.getPriority());
            }
        }

        getExtensions<T extends Extension>(point: string): T[] {

            const list = this._map.get(point);

            if (!list) {
                
                return [];
            }

            list.sort((a, b) => a.getPriority() - b.getPriority());

            return list as any;
        }

    }
}