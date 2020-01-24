namespace phasereditor2d.scene.ui.viewers {

    import controls = colibri.ui.controls;

    export class ObjectExtensionAndPrefabViewer extends controls.viewers.TreeViewer {

        constructor() {
            super();

            this.setLabelProvider(new ObjectExtensionAndPrefabLabelProvider());
            this.setCellRendererProvider(new ObjectExtensionAndPrefabCellRendererProvider());
            this.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            this.setInput([
                ...ScenePlugin.getInstance().getObjectExtensions(),
                ...ScenePlugin.getInstance().getSceneFinder().getPrefabFiles()
            ]);
        }
    }
}