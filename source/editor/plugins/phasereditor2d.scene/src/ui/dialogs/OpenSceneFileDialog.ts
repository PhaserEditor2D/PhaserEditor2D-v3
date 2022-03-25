namespace phasereditor2d.scene.ui.dialogs {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    const grouping = pack.ui.viewers.AssetPackGrouping;

    export class OpenSceneFileDialog extends controls.dialogs.ViewerDialog {

        constructor() {
            super(new controls.viewers.TreeViewer("phasereditor2d.scene.ui.dialogs.OpenSceneFileDialog"), true);

            this.setSize(900, 500, true);
        }

        create() {

            super.create();

            this.setTitle("Go To Scene");

            const viewer = this.getViewer() as controls.viewers.TreeViewer;

            const finder = ScenePlugin.getInstance().getSceneFinder();

            viewer.setContentProvider(new ContentProvider(finder));
            viewer.setLabelProvider(new blocks.SceneEditorBlocksLabelProvider());
            viewer.setCellRendererProvider(new blocks.SceneEditorBlocksCellRendererProvider());
            viewer.setTreeRenderer(new TreeRenderer(viewer));
            viewer.setInput([]);

            viewer.expandRoots();

            this.enableButtonOnlyWhenOneElementIsSelected(this.addOpenButton("Open", () => {

                colibri.Platform.getWorkbench().openEditor(viewer.getSelectionFirstElement());
            }));

            this.getFilteredViewer().setMenuProvider(new controls.viewers.DefaultViewerMenuProvider((viewer1, menu) => {

                const currentType = getSceneGroupingPreference();

                for (const type of [grouping.GROUP_ASSETS_BY_TYPE, grouping.GROUP_ASSETS_BY_LOCATION]) {

                    menu.addAction({
                        text: "Group By " + grouping.GROUP_ASSET_TYPE_LABEL_MAP[type],
                        selected: type === currentType,
                        callback: () => {

                            setSceneGroupingPreference(type);

                            viewer.setScrollY(0);
                            viewer.expandRoots();
                        }
                    })
                }
            }));
        }
    }

    function getSceneGroupingPreference() {

        return window.localStorage["phasereditor2d.scene.ui.dialogs.OpenSceneFileDialog.groupingType"] || grouping.GROUP_ASSETS_BY_TYPE;
    }

    function setSceneGroupingPreference(type: string) {

        window.localStorage["phasereditor2d.scene.ui.dialogs.OpenSceneFileDialog.groupingType"] = type;
    }

    class TreeRenderer extends controls.viewers.GridTreeViewerRenderer {

        constructor(viewer: controls.viewers.TreeViewer) {
            super(viewer);

            this.setPaintItemShadow(true);
            this.setSectionCriteria(obj => typeof obj === "string"
                || obj instanceof io.FilePath && obj.isFolder() || obj instanceof viewers.PhaserTypeSymbol);
        }
    }

    class ContentProvider implements controls.viewers.ITreeContentProvider {

        constructor(private finder: core.json.SceneFinder) {

        }

        getRoots(input: any): any[] {

            const type = getSceneGroupingPreference();

            if (type === grouping.GROUP_ASSETS_BY_TYPE) {

                return viewers.PhaserTypeSymbol.getSymbols().filter(s => this.getChildren(s).length > 0);
            }

            return colibri.ui.ide.FileUtils.distinct(this.finder.getSceneFiles().map(f => f.getParent()));
        }

        getChildren(parent: any): any[] {

            if (parent instanceof viewers.PhaserTypeSymbol) {

                return this.finder.getSceneFiles()
                    .filter(file => this.finder.getScenePhaserType(file) === parent.getPhaserType());
            }

            if (parent instanceof io.FilePath && parent.isFolder()) {

                return this.finder.getSceneFiles().filter(f => f.getParent() === parent);
            }

            return [];
        }

    }
}