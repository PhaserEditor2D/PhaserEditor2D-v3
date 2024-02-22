var phasereditor2d;
(function (phasereditor2d) {
    var blocks;
    (function (blocks) {
        class BlocksPlugin extends colibri.Plugin {
            static _instance = new BlocksPlugin();
            static getInstance() {
                return this._instance;
            }
            constructor() {
                super("phasereditor2d.blocks");
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
                class BlocksView extends ide.EditorViewerView {
                    static EDITOR_VIEWER_PROVIDER_KEY = "Blocks";
                    constructor() {
                        super("BlocksView");
                        this.setTitle("Blocks");
                        this.setIcon(phasereditor2d.resources.getIcon(phasereditor2d.resources.ICON_BLOCKS));
                    }
                    getViewerProvider(editor) {
                        return editor.getEditorViewerProvider(BlocksView.EDITOR_VIEWER_PROVIDER_KEY);
                    }
                }
                views.BlocksView = BlocksView;
            })(views = ui.views || (ui.views = {}));
        })(ui = blocks.ui || (blocks.ui = {}));
    })(blocks = phasereditor2d.blocks || (phasereditor2d.blocks = {}));
})(phasereditor2d || (phasereditor2d = {}));
