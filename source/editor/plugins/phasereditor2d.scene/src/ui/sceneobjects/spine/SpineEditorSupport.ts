namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export interface ISpineObjectData extends core.json.IObjectData {
        dataKey: string;
        atlasKey: string;
    }

    export class SpineEditorSupport extends GameObjectEditorSupport<SpineObject>{

        constructor(obj: SpineObject, scene: Scene) {

            super(SpineExtension.getInstance(), obj, scene);

            this.addComponent(
                new SpineComponent(obj),
                new TransformComponent(obj),
                new ArcadeComponent(obj, false));
        }

        setInteractive(): void {

            this.getObject().setInteractive();
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            return new controls.viewers.IconImageCellRenderer(resources.getIcon(resources.ICON_SPINE));
        }
    }
}