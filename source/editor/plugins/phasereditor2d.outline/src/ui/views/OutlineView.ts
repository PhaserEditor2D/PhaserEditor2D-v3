namespace phasereditor2d.outline.ui.views {

    import ide = colibri.ui.ide;

    export class OutlineView extends ide.EditorViewerView {

        static EDITOR_VIEWER_PROVIDER_KEY = "Outline";

        constructor() {
            super("OutlineView");

            this.setTitle("Outline");
            this.setIcon(OutlinePlugin.getInstance().getIcon(ICON_OUTLINE));
        }
        
        getPropertyProvider() {

            console.log("here here !!!");

            return super.getPropertyProvider();
        }

        getViewerProvider(editor: ide.EditorPart): ide.EditorViewerProvider {

            return editor.getEditorViewerProvider(OutlineView.EDITOR_VIEWER_PROVIDER_KEY);
        }

        protected createViewer() {

            const viewer = super.createViewer();

            viewer.setSorted(false);

            return viewer;
        }
    }
}