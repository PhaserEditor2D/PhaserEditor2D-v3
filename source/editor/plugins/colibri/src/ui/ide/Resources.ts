namespace colibri.ui.ide {

    export class Resources {

        private _plugin: Plugin;
        private _res: any;

        constructor(plugin: Plugin) {

            this._plugin = plugin;
        }

        async preload() {

            this._res = await this._plugin.getJSON("res.json");
        }

        getResString(key: string) {

            return this.getResData(key) as string;
        }

        getResData(key: string) {

            return this._res[key];
        }
    }
}