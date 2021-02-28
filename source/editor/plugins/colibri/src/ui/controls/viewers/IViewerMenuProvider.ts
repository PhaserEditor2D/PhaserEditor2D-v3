namespace colibri.ui.controls.viewers {

    export interface IViewerMenuProvider {

        fillMenu(viewer: TreeViewer, menu: Menu): void;
    }
}