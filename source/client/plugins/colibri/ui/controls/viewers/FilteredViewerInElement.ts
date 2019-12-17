namespace colibri.ui.controls.viewers {

    export class FilteredViewerInElement<T extends Viewer> extends FilteredViewer<T> {

        constructor(viewer: T, ...classList: string[]) {
            super(viewer, ...classList);

            this.setHandlePosition(false);
            this.style.position = "relative";
            this.style.height = "100%";

            this.resizeTo();
        }

        resizeTo() {

            setTimeout(() => {

                const parent = this.getElement().parentElement;

                if (parent) {

                    this.setBounds({
                        width: parent.clientWidth,
                        height: parent.clientHeight
                    });
                }

                this.getViewer().repaint();

            }, 10);
        }
    }
}