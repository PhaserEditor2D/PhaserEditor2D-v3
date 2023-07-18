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

        getThemeIcon(name: string, theme: "dark" | "light" | "common") {

            const x2 = ui.controls.ICON_SIZE === 32;

            return ui.controls.Controls
                .getImage(`/editor/app/plugins/${this.getId()}/icons/${theme}/${name}${x2 ? "@2x" : ""}.png`, theme + "." + name);
        }

        getIconDescriptor(name: string) {

            return new ui.controls.IconDescriptor(this, name);
        }

        getIcon(name: string, common: boolean = false) {

            if (this._iconCache.has(name)) {

                return this._iconCache.get(name);
            }

            const image = new ui.controls.IconImage(this, name, common);

            this._iconCache.set(name, image);

            return image;
        }

        getResourceURL(pathInPlugin: string, version?: string) {

            if (version === undefined) {

                version = Date.now().toString();
            }

            return `/editor/app/plugins/${this.getId()}/${pathInPlugin}?v=${version}`;
        }

        async getJSON(pathInPlugin: string, version?: string) {

            const url = this.getResourceURL(pathInPlugin, version);

            const result = await fetch(url);

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