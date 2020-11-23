namespace colibri {

    export let CACHE_VERSION = "1";

    export class Platform {

        private static _plugins: colibri.Plugin[] = [];
        private static _extensionRegistry: ExtensionRegistry;

        static addPlugin(plugin: colibri.Plugin) {
            this._plugins.push(plugin);
        }

        static getPlugins() {
            return this._plugins;
        }

        static getExtensionRegistry() {

            if (!this._extensionRegistry) {
                this._extensionRegistry = new ExtensionRegistry();
            }

            return this._extensionRegistry;
        }

        static getExtensions<T extends Extension>(point: string): T[] {
            return this._extensionRegistry.getExtensions<T>(point);
        }

        static addExtension(...extensions: Extension[]) {
            this._extensionRegistry.addExtension(...extensions);
        }

        static getWorkbench() {
            return ui.ide.Workbench.getWorkbench();
        }

        static start() {
            return this.getWorkbench().launch();
        }

        static getElectron() {

            return window["electron"] as IElectron;
        }

        static onElectron(callback: (electron: IElectron) => void, elseCallback?: ()=>void) {

            if (this.getElectron()) {

                callback(this.getElectron());

            } else if (elseCallback) {

                elseCallback();
            }
        }
    }
}