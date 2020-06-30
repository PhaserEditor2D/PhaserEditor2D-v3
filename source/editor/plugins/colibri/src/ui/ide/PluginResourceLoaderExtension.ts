namespace colibri.ui.ide {

    export class PluginResourceLoaderExtension extends Extension {

        static POINT_ID = "colibri.ui.ide.PluginResourceLoaderExtension";

        private _loader: () => Promise<void>;

        constructor(loader?: () => Promise<void>) {
            super(PluginResourceLoaderExtension.POINT_ID);

            this._loader = loader;
        }

        async preload(): Promise<void> {

            if (this._loader) {

                await this._loader();
            }
        }
    }
}