namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineEditorSupport extends GameObjectEditorSupport<SpineObject>{

        constructor(obj: SpineObject, scene: Scene) {

            super(SpineExtension.getInstance(), obj, scene);

            this.addComponent(
                new TransformComponent(obj),
                new OriginComponent(obj))
        }

        setInteractive(): void {

            this.getObject().setInteractive();
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            return new controls.viewers.IconImageCellRenderer(resources.getIcon(resources.ICON_SPINE));
        }
    }
}