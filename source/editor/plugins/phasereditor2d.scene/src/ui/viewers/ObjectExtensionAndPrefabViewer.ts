namespace phasereditor2d.scene.ui.viewers {

    import controls = colibri.ui.controls;

    export class ObjectExtensionAndPrefabViewer extends controls.viewers.TreeViewer {

        static PREFAB_SECTION = "User Prefab";

        static SECTIONS = [
            ...SCENE_OBJECT_CATEGORIES,
            ObjectExtensionAndPrefabViewer.PREFAB_SECTION,
        ];

        constructor() {
            super("phasereditor2d.scene.ui.viewers.ObjectExtensionAndPrefabViewer");

            const treeRenderer = new controls.viewers.GridTreeViewerRenderer(this);
            treeRenderer.setPaintItemShadow(true);
            treeRenderer.setSectionCriteria(obj => ObjectExtensionAndPrefabViewer.SECTIONS.indexOf(obj) >= 0);

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

            if (SCENE_OBJECT_CATEGORY_SET.has(parent)) {

                return plugin.getGameObjectExtensions().filter(ext => ext.getCategory() === parent);

            } else if (parent === ObjectExtensionAndPrefabViewer.PREFAB_SECTION) {

                return plugin.getSceneFinder().getPrefabFiles();
            }

            return [];
        }
    }
}