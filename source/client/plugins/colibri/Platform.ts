namespace colibri {

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
    }
}