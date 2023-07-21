
namespace phasereditor2d.blocks.ui.views {

    import ide = colibri.ui.ide;

    export class BlocksView extends ide.EditorViewerView {

        static EDITOR_VIEWER_PROVIDER_KEY = "Blocks";

        constructor() {
            super("BlocksView");

            this.setTitle("Blocks");

            this.setIcon(resources.getIcon(resources.ICON_BLOCKS));
        }

        getViewerProvider(editor: ide.EditorPart) {

            return editor.getEditorViewerProvider(BlocksView.EDITOR_VIEWER_PROVIDER_KEY);
        }
    }
}