namespace phasereditor2d.ide.core {

    export class PhaserDocs {

        private _data: any = null;
        private _plugin: colibri.Plugin;
        private _filePath: string;

        constructor(plugin: colibri.Plugin, filePath: string) {

            this._plugin = plugin;
            this._filePath = filePath;
        }

        async preload() {

            if (!this._data) {

                this._data = await this._plugin.getJSON(this._filePath);

                const converter = new showdown.Converter();

                // tslint:disable-next-line:forin
                for (const k in this._data) {

                    const help = this._data[k];

                    this._data[k] = converter.makeHtml(help);
                }
            }
        }

        getDoc(helpKey): string {

            if (helpKey in this._data) {
                return `<small>${helpKey}</small> <br><br> <div style="max-width:60em">${this._data[helpKey]}</div>`;
            }

            return "Help not found for: " + helpKey;
        }

    }
}