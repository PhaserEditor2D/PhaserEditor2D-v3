namespace phasereditor2d.scene.ui.dialogs {

    import controls = colibri.ui.controls;

    export class OpenSceneFileDialog extends controls.dialogs.ViewerDialog {

        constructor() {
            super(new controls.viewers.TreeViewer("phasereditor2d.scene.ui.dialogs.OpenSceneFileDialog"), true);

            this.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5);
        }

        create() {

            super.create();

            this.setTitle("Open Scene File");

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
        }
    }

    class TreeRenderer extends controls.viewers.GridTreeViewerRenderer {

        constructor(viewer: controls.viewers.TreeViewer) {
            super(viewer);

            this.setPaintItemShadow(true);
            this.setSectionCriteria(obj => typeof obj === "string");
        }
    }

    class ContentProvider implements controls.viewers.ITreeContentProvider {

        constructor(private finder: core.json.SceneFinder) {

        }

        getRoots(input: any): any[] {

            return ["Scenes", "Prefabs"];
        }

        getChildren(parent: any): any[] {

            switch (parent) {

                case "Scenes":

                    const prefabs = new Set(this.finder.getPrefabFiles());

                    return this.finder.getSceneFiles().filter(f => !prefabs.has(f));

                case "Prefabs":

                    return this.finder.getPrefabFiles();
            }

            return [];
        }

    }
}