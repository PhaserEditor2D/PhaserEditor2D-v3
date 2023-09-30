namespace phasereditor2d.ide.core {

    export class PhaserDocs {

        private _data: any = {};

        constructor(plugin: colibri.Plugin, ...resKeys: string[]) {

            for (const resKey of resKeys) {

                const resData = plugin.getResources().getResData(resKey);

                const converter = new showdown.Converter();

                for (const k of Object.keys(resData)) {

                    const help = resData[k];

                    const html = converter.makeHtml(help);

                    this._data[k] = html;
                }
            }
        }

        static markdownToHtml(txt: string) {

            const converter = new showdown.Converter();

            return converter.makeHtml(txt);
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