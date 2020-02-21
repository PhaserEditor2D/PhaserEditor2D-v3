namespace colibri.ui.ide.actions {

    export abstract class ViewerViewAction<T extends ide.ViewerView> extends PartAction<T> {

        constructor(view: T, config: controls.IActionConfig) {
            super(view, config);
        }

        getViewViewer() {
            return this.getPart().getViewer();
        }

        getViewViewerSelection() {
            return this.getViewViewer().getSelection();
        }
    }
}