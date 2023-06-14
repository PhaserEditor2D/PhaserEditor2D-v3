namespace phasereditor2d.ide.core {

    export class PhaserDocs {

        private _data: any = null;
        private _plugin: colibri.Plugin;
        private _files: string[];

        constructor(plugin: colibri.Plugin, ...files: string[]) {

            this._plugin = plugin;
            this._files = files;
        }

        async preload() {

            if (!this._data) {

                this._data = {};

                for (const file of this._files) {

                    console.log("Loading jsdoc " + this._plugin.getId() + ": " + file);

                    const fileData = await this._plugin.getJSON(file);

                    const converter = new showdown.Converter();

                    // tslint:disable-next-line:forin
                    for (const k in fileData) {

                        const help = fileData[k];

                        this._data[k] = converter.makeHtml(help);
                    }
                }
            }
        }

        getDoc(helpKey: string, wrap = true): string {

            if (helpKey in this._data) {

                if (wrap) {

                    return `<small>${helpKey}</small> <br><br> <div style="max-width:60em">${this._data[helpKey]}</div>`;
                }

                return this._data[helpKey];
            }

            return "Help not found for: " + helpKey;
        }

        getKeys() {

            return Object.keys(this._data);
        }
    }
}