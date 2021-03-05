namespace phasereditor2d.animations.ui.editors {

    import controls = colibri.ui.controls;

    export class AnimationsEditorBlocksProvider
        extends pack.ui.viewers.AbstractAssetPackClientBlocksProvider<AnimationsEditor> {

        constructor(editor: AnimationsEditor) {
            super(editor);
        }

        fillContextMenu(menu: controls.Menu) {

            pack.ui.viewers.AssetPackGrouping.fillMenu(menu, () => this.repaint(true));
        }

        async preloadAndGetFinder(complete?: boolean): Promise<pack.core.PackFinder> {

            const finder = new pack.core.PackFinder();

            await finder.preload();

            return finder;
        }

        getContentProvider() {

            return new AnimationsEditorBlocksContentProvider(this.getEditor(), () => this.getPacks());
        }

        getTreeViewerRenderer(viewer: colibri.ui.controls.viewers.TreeViewer) {

            return new pack.ui.viewers.AssetPackTreeViewerRenderer(viewer, false);
        }

        getPropertySectionProvider() {

            return this.getEditor().getPropertyProvider();
        }

        getInput() {

            return this.getPacks();
        }
    }
}