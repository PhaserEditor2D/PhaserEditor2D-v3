namespace colibri.ui.controls.viewers {

    export class DefaultViewerMenuProvider implements IViewerMenuProvider {

        constructor(private builder?: (viewer:TreeViewer, menu: Menu)=>void) {

        }

        fillMenu(viewer: TreeViewer, menu: Menu): void {

            if (this.builder) {

                this.builder(viewer, menu);

                menu.addSeparator();
            }

            menu.addAction({
                commandId: ide.actions.CMD_COLLAPSE_ALL,
                callback: () => viewer.collapseAll()
            });

            menu.addAction({
                commandId: ide.actions.CMD_EXPAND_COLLAPSE_BRANCH,
                callback: () => viewer.expandCollapseBranch()
            });
        }
    }
}