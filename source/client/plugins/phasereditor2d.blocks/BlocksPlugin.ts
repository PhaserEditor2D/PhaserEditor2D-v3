namespace phasereditor2d.blocks {

    import ide = colibri.ui.ide;

    export const ICON_BLOCKS = "blocks";

    export class BlocksPlugin extends colibri.Plugin {

        private static _instance = new BlocksPlugin();

        static getInstance() {
            return this._instance;
        }

        private constructor() {
            super("phasereditor2d.blocks");
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            reg.addExtension(
                ide.IconLoaderExtension.withPluginFiles(this, [
                    ICON_BLOCKS
                ])
            );
        }
    }

    colibri.Platform.addPlugin(BlocksPlugin.getInstance());
}