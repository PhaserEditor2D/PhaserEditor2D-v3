namespace phasereditor2d.scene.ui.viewers {

    import controls = colibri.ui.controls;

    export class ObjectExtensionAndPrefabViewer extends controls.viewers.TreeViewer {

        static BUILT_IN_SECTION = "Built-In";
        static PREFAB_SECTION = "User Prefab";

        static SECTIONS = [
            ObjectExtensionAndPrefabViewer.BUILT_IN_SECTION,
            ObjectExtensionAndPrefabViewer.PREFAB_SECTION,
        ];

        constructor() {
            super("phasereditor2d.scene.ui.viewers.ObjectExtensionAndPrefabViewer");

            const treeRenderer = new controls.viewers.ShadowGridTreeViewerRenderer(this);

            treeRenderer.setSections(ObjectExtensionAndPrefabViewer.SECTIONS);

            this.setLabelProvider(new ui.blocks.SceneEditorBlocksLabelProvider());
            this.setCellRendererProvider(new ui.blocks.SceneEditorBlocksCellRendererProvider());
            this.setContentProvider(new ObjectExtensionAndPrefabContentProvider());
            this.setTreeRenderer(treeRenderer);
            this.setInput(ObjectExtensionAndPrefabViewer.SECTIONS);

            this.setCellSize(78 * controls.DEVICE_PIXEL_RATIO, true);
        }
    }

    export class ObjectExtensionAndPrefabContentProvider implements controls.viewers.ITreeContentProvider {

        getRoots(input: any): any[] {
            return ObjectExtensionAndPrefabViewer.SECTIONS;
        }

        getChildren(parent: any): any[] {

            const plugin = ScenePlugin.getInstance();

            if (parent === ObjectExtensionAndPrefabViewer.BUILT_IN_SECTION) {

                return plugin.getGameObjectExtensions();

            } else if (parent === ObjectExtensionAndPrefabViewer.PREFAB_SECTION) {

                return plugin.getSceneFinder().getPrefabFiles();
            }

            return [];
        }
    }
}