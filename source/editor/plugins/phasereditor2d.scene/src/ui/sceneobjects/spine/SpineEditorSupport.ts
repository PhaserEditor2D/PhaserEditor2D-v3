namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineEditorSupport extends GameObjectEditorSupport<SpineObject>{

        setInteractive(): void {

            // TODO
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            return new controls.viewers.IconImageCellRenderer(resources.getIcon(resources.ICON_SPINE));
        }
    }
}