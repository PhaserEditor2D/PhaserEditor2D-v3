namespace colibri {

    export abstract class Plugin {

        private _id: string;
        private _iconCache: Map<string, ui.controls.IconImage>;

        constructor(id: string) {

            this._id = id;

            this._iconCache = new Map();
        }

        getId() {
            return this._id;
        }

        starting(): Promise<void> {
            return Promise.resolve();
        }

        started(): Promise<void> {
            return Promise.resolve();
        }

        registerExtensions(registry: ExtensionRegistry): void {
            // nothing
        }

        getThemeIcon(name: string, theme: "dark" | "light") {

            const x2 = ui.controls.ICON_SIZE === 32;

            return ui.controls.Controls
                .getImage(`app/plugins/${this.getId()}/icons/${theme}/${name}${x2 ? "@2x" : ""}.png`, theme + "." + name);
        }

        getIcon(name: string) {

            if (this._iconCache.has(name)) {

                return this._iconCache.get(name);
            }

            const image = new ui.controls.IconImage(this, name);

            this._iconCache.set(name, image);

            return image;
        }

        getResourceURL(pathInPlugin: string) {
            return `app/plugins/${this.getId()}/${pathInPlugin}?v=${CACHE_VERSION}`;
        }

        async getJSON(pathInPlugin: string) {

            const result = await fetch(this.getResourceURL(pathInPlugin));

            const data = await result.json();

            return data;
        }

        async getString(pathInPlugin: string) {

            const result = await fetch(this.getResourceURL(pathInPlugin));

            const data = await result.text();

            return data;
        }
    }
}