namespace phasereditor2d.scene.ui.viewers {

    import controls = colibri.ui.controls;

    export class ObjectExtensionCellRendererProvider extends controls.viewers.EmptyCellRendererProvider {

        constructor() {
            super();
        }

        getCellRenderer(element: any) {

            const ext = element as sceneobjects.SceneGameObjectExtension;

            return new controls.viewers.IconImageCellRenderer(ext.getIcon());
        }
    }
}