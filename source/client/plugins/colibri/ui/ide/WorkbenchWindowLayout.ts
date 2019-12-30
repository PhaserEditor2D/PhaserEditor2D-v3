namespace colibri.ui.ide {

    const TOOLBAR_HEIGHT = 40;

    export class WorkbenchWindowLayout implements controls.ILayout {

        layout(parent: controls.Control) {

            const win = parent as WorkbenchWindow;
            const toolbar = win.getToolbar();
            const clientArea = win.getClientArea();

            const b = win.getBounds();

            b.x = 0;
            b.y = 0;
            b.width = window.innerWidth;
            b.height = window.innerHeight;

            controls.setElementBounds(win.getElement(), b);

            toolbar.setBoundsValues(0, 0, b.width, TOOLBAR_HEIGHT);

            clientArea.setBoundsValues(0, TOOLBAR_HEIGHT, b.width, b.height - TOOLBAR_HEIGHT);
        }
    }
}