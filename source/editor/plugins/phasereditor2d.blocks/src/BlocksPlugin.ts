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

        async refreshBlocksView() {

            // refresh Blocks view

            const editor = colibri.Platform.getWorkbench().getActiveEditor();

            if (editor) {

                const provider = editor.getEditorViewerProvider(
                    blocks.ui.views.BlocksView.EDITOR_VIEWER_PROVIDER_KEY);

                if (provider) {

                    await provider.preload(true);

                    provider.repaint();
                }
            }
        }
    }

    colibri.Platform.addPlugin(BlocksPlugin.getInstance());
}