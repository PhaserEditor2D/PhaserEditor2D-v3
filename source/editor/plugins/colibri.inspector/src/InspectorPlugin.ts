namespace colibri.inspector {

    import ide = colibri.ui.ide;

    export const ICON_INSPECTOR = "inspector";

    export class InspectorPlugin extends colibri.Plugin {

        private static _instance = new InspectorPlugin();

        static getInstance() {
            return this._instance;
        }

        private constructor() {
            super("colibri.inspector");
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            reg.addExtension(
                ide.IconLoaderExtension.withPluginFiles(this, [
                    ICON_INSPECTOR
                ], true)
            );

        }
    }

    colibri.Platform.addPlugin(InspectorPlugin.getInstance());
}