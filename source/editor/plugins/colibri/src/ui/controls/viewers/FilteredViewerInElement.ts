namespace colibri.ui.controls.viewers {

    export class FilteredViewerInElement<T extends TreeViewer> extends FilteredViewer<T> {

        constructor(viewer: T, showZoomControls: boolean, ...classList: string[]) {
            super(viewer, showZoomControls, ...classList);

            this.setHandlePosition(false);
            this.style.position = "relative";
            this.style.height = "100%";

            this.resizeTo();

            setTimeout(() => this.resizeTo(), 10);
        }

        resizeTo() {

            const parent = this.getElement().parentElement;

            if (parent) {

                this.setBounds({
                    width: parent.clientWidth,
                    height: parent.clientHeight
                });
            }

            this.getViewer().repaint();
        }
    }
}