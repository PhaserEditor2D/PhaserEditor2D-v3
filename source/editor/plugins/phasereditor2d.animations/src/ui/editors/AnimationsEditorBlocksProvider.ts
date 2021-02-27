namespace phasereditor2d.animations.ui.editors {

    import controls = colibri.ui.controls;

    export class AnimationsEditorBlocksProvider
        extends pack.ui.viewers.AbstractAssetPackClientBlocksProvider<AnimationsEditor> {

        constructor(editor: AnimationsEditor) {
            super(editor);
        }

        fillContextMenu(menu: controls.Menu) {

            const grouping = pack.ui.viewers.AssetPackGrouping;

            const currentType = grouping.getGroupingPreference();

            for (const type of grouping.GROUP_ASSET_TYPES) {

                menu.addAction({
                    text: "Group Assets By " + grouping.GROUP_ASSET_TYPE_LABEL_MAP[type],
                    callback: () => {

                        grouping.setGroupingPreference(type);

                        this.repaint(true);
                    },
                    selected: type === currentType
                });
            }
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