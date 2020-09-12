namespace colibri {

    export abstract class Plugin {

        private _id: string;

        constructor(id: string) {
            this._id = id;
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

        getIcon(name: string): ui.controls.IImage {

            const x2 = ui.controls.ICON_SIZE === 32;

            return ui.controls.Controls
                .getImage(`app/plugins/${this.getId()}/icons/dark/${name}${x2 ? "@2x" : ""}.png`, name);
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