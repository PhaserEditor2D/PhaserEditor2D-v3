namespace phasereditor2d.scene.ui.viewers {

    import controls = colibri.ui.controls;

    export class ObjectExtensionAndPrefabViewer extends controls.viewers.TreeViewer {

        static TYPE_SECTION = "Phaser Type";
        static PREFAB_SECTION = "User Prefab";

        static SECTIONS = [
            ObjectExtensionAndPrefabViewer.TYPE_SECTION,
            ObjectExtensionAndPrefabViewer.PREFAB_SECTION,
        ];

        constructor() {
            super();

            const treeRenderer = new controls.viewers.ShadowGridTreeViewerRenderer(this);

            treeRenderer.setSections(ObjectExtensionAndPrefabViewer.SECTIONS);

            this.setLabelProvider(new ObjectExtensionAndPrefabLabelProvider());
            this.setCellRendererProvider(new ObjectExtensionAndPrefabCellRendererProvider());
            this.setContentProvider(new ObjectExtensionAndPrefabContentProvider());
            this.setTreeRenderer(treeRenderer);
            this.setInput(ObjectExtensionAndPrefabViewer.SECTIONS);

            this.setCellSize(64);
        }
    }

    class ObjectExtensionAndPrefabContentProvider implements controls.viewers.ITreeContentProvider {

        getRoots(input: any): any[] {
            return ObjectExtensionAndPrefabViewer.SECTIONS;
        }

        getChildren(parent: any): any[] {

            const plugin = ScenePlugin.getInstance();

            if (parent === ObjectExtensionAndPrefabViewer.TYPE_SECTION) {

                return plugin.getObjectExtensions();

            } else if (parent === ObjectExtensionAndPrefabViewer.PREFAB_SECTION) {

                return plugin.getSceneFinder().getPrefabFiles();
            }

            return [];
        }
    }
}