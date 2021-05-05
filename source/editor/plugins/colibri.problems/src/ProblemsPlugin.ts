namespace colibri.problems {

    export const ICON_ERROR = "error";

    export class ProblemsPlugin extends colibri.Plugin {

        private static _instance = new ProblemsPlugin();

        static getInstance() {

            return this._instance;
        }

        constructor() {
            super("colibri.problems");
        }

        registerExtensions(reg: ExtensionRegistry) {

            reg.addExtension(colibri.ui.ide.IconLoaderExtension.withPluginFiles(this, [
                ICON_ERROR
            ]));
        }
    }

    colibri.Platform.addPlugin(ProblemsPlugin.getInstance());
}