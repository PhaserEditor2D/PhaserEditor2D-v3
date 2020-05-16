var phasereditor2d;
(function (phasereditor2d) {
    var blocks;
    (function (blocks) {
        var ide = colibri.ui.ide;
        blocks.ICON_BLOCKS = "blocks";
        let BlocksPlugin = /** @class */ (() => {
            class BlocksPlugin extends colibri.Plugin {
                constructor() {
                    super("phasereditor2d.blocks");
                }
                static getInstance() {
                    return this._instance;
                }
                registerExtensions(reg) {
                    reg.addExtension(ide.IconLoaderExtension.withPluginFiles(this, [
                        blocks.ICON_BLOCKS
                    ]));
                }
                async refreshBlocksView() {
                    // refresh Blocks view
                    const editor = colibri.Platform.getWorkbench().getActiveEditor();
                    if (editor) {
                        const provider = editor.getEditorViewerProvider(blocks.ui.views.BlocksView.EDITOR_VIEWER_PROVIDER_KEY);
                        if (provider) {
                            await provider.preload(true);
                            provider.repaint();
                        }
                    }
                }
            }
            BlocksPlugin._instance = new BlocksPlugin();
            return BlocksPlugin;
        })();
        blocks.BlocksPlugin = BlocksPlugin;
        colibri.Platform.addPlugin(BlocksPlugin.getInstance());
    })(blocks = phasereditor2d.blocks || (phasereditor2d.blocks = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var blocks;
    (function (blocks) {
        var ui;
        (function (ui) {
            var views;
            (function (views) {
                var ide = colibri.ui.ide;
                let BlocksView = /** @class */ (() => {
                    class BlocksView extends ide.EditorViewerView {
                        constructor() {
                            super("BlocksView");
                            this.setTitle("Blocks");
                            this.setIcon(blocks.BlocksPlugin.getInstance().getIcon(blocks.ICON_BLOCKS));
                        }
                        getViewerProvider(editor) {
                            return editor.getEditorViewerProvider(BlocksView.EDITOR_VIEWER_PROVIDER_KEY);
                        }
                    }
                    BlocksView.EDITOR_VIEWER_PROVIDER_KEY = "Blocks";
                    return BlocksView;
                })();
                views.BlocksView = BlocksView;
            })(views = ui.views || (ui.views = {}));
        })(ui = blocks.ui || (blocks.ui = {}));
    })(blocks = phasereditor2d.blocks || (phasereditor2d.blocks = {}));
})(phasereditor2d || (phasereditor2d = {}));
