namespace phasereditor2d.scene.ui.viewers {

    import controls = colibri.ui.controls;

    export class ObjectExtensionCellRendererProvider extends controls.viewers.EmptyCellRendererProvider {

        constructor() {
            super(_ => new controls.viewers.IconImageCellRenderer(ScenePlugin.getInstance().getIcon(ICON_GROUP)));
        }
    }
}