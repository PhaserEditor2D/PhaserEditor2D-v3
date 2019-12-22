namespace phasereditor2d.ide.core {

    export class PhaserDocs {

        private _data: any = null;
        private _plugin : colibri.Plugin;
        private _filePath: string;

        constructor(plugin : colibri.Plugin, filePath : string) {
            
            this._plugin = plugin;
            this._filePath = filePath;
        }

        async preload() {

            if (!this._data) {

                this._data = await this._plugin.getJSON(this._filePath);
            }
        }

        getDoc(type: string, member: string, param?: string): string {

            const key = type + "#" + member + (param ? "@" + param : "");

            const signature = type + "." + member + (param ? "(" + param + ")" : "");

            return `<small>${signature}</small> <br> ${this._data[key]}`;
        }

    }
}