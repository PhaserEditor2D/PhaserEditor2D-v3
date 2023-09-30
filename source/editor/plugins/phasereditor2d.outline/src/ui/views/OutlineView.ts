namespace phasereditor2d.outline.ui.views {

    import ide = colibri.ui.ide;

    export class OutlineView extends ide.EditorViewerView {

        static EDITOR_VIEWER_PROVIDER_KEY = "Outline";

        constructor() {
            super("OutlineView");

            this.setTitle("Outline");
            this.setIcon(resources.getIcon(resources.ICON_OUTLINE));
        }

        getViewerProvider(editor: ide.EditorPart): ide.EditorViewerProvider {

            return editor.getEditorViewerProvider(OutlineView.EDITOR_VIEWER_PROVIDER_KEY);
        }
    }
}