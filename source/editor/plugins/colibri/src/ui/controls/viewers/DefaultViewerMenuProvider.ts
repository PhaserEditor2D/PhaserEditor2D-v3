namespace colibri.ui.controls.viewers {

    export class DefaultViewerMenuProvider implements IViewerMenuProvider {

        fillMenu(viewer: TreeViewer, menu: Menu): void {

            menu.addAction({
                commandId: ide.actions.CMD_COLLAPSE_ALL,
                callback: () => viewer.collapseAll()
            });

            menu.addAction({
                commandId: ide.actions.CMD_EXPAND_COLLAPSE_BRANCH,
                callback: () => viewer.expandCollapseBranch()
            })
        }
    }
}