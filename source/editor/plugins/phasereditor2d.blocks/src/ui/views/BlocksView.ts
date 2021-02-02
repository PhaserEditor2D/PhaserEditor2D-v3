
namespace phasereditor2d.blocks.ui.views {

    import ide = colibri.ui.ide;

    export class BlocksView extends ide.EditorViewerView {

        static EDITOR_VIEWER_PROVIDER_KEY = "Blocks";

        constructor() {
            super("BlocksView");

            this.setTitle("Blocks");

            this.setIcon(BlocksPlugin.getInstance().getIcon(ICON_BLOCKS));
        }

        getViewerProvider(editor: ide.EditorPart) {

            return editor.getEditorViewerProvider(BlocksView.EDITOR_VIEWER_PROVIDER_KEY);
        }

        createPart() {

            super.createPart();

            setTimeout(() => {

                const folder = this.getPartFolder();

                const label = folder.getLabelFromContent(this);

                folder.addTabSection(label, "Built-In");
                folder.addTabSection(label, "Prefabs");
                folder.addTabSection(label, "Assets");
                folder.addTabSection(label, "Folder");

            }, 1000);
        }
    }
}