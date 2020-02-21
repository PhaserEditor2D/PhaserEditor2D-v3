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
            return ui.controls.Controls.getIcon(name, `plugins/${this.getId()}/icons`);
        }

        async getJSON(pathInPlugin: string) {

            const result = await fetch(`static/plugins/${this.getId()}/` + pathInPlugin);

            const data = await result.json();

            return data;
        }
    }
}