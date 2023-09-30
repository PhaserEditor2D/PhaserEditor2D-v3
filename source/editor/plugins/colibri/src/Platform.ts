namespace colibri {

    export let PRODUCT_VERSION = "1";

    export class Platform {

        private static _plugins: colibri.Plugin[] = [];
        private static _extensionRegistry: ExtensionRegistry;
        private static _product: IProduct;

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

        static async loadProduct(bypassCache = true) {

            try {

                const url = bypassCache ?
                    `/editor/product.json?v=${Date.now()}` :
                    `/editor/product.json`;

                const resp = await fetch(url, {
                    method: "GET",
                    cache: "no-cache"
                });

                this._product = await resp.json();

                PRODUCT_VERSION = this._product.version;

            } catch (e) {

                console.log(e);

                throw new Error("Cannot fetch product configuration.");
            }
        }

        static async start() {

            await this.getWorkbench().launch();
        }

        static getProduct() {

            return this._product;
        }

        static getProductOption(key: string) {

            return (this._product as any)[key];
        }

        static getElectron() {

            return window["electron"] as IElectron;
        }

        static onElectron(callback: (electron: IElectron) => void, elseCallback?: () => void) {

            if (this.getElectron()) {

                callback(this.getElectron());

            } else if (elseCallback) {

                elseCallback();
            }
        }

        static isOnElectron() {

            return Boolean(this.getElectron());
        }
    }
}