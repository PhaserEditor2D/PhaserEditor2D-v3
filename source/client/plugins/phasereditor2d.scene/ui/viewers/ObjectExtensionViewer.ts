namespace phasereditor2d.scene.ui.viewers {

    import controls = colibri.ui.controls;

    export class ObjectExtensionViewer extends controls.viewers.TreeViewer {

        constructor() {
            super();

            this.setLabelProvider(new ObjectExtensionLabelProvider());
            this.setCellRendererProvider(new ObjectExtensionCellRendererProvider());
            this.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            this.setInput(ScenePlugin.getInstance().getObjectExtensions());
        }
    }
}