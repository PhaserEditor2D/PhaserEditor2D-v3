namespace phasereditor2d.outline {

    import ide = colibri.ui.ide;

    export const ICON_OUTLINE = "outline";

    export class OutlinePlugin extends colibri.Plugin {

        private static _instance = new OutlinePlugin();

        static getInstance() {
            return this._instance;
        }

        constructor() {
            super("phasereditor2d.outline");
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            reg.addExtension(
                ide.IconLoaderExtension.withPluginFiles(this, [
                    ICON_OUTLINE
                ])
            );
        }
    }

    colibri.Platform.addPlugin(OutlinePlugin.getInstance());
}