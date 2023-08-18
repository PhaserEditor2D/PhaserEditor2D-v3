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
                new TransformComponent(obj),
                new SpineComponent(obj));
        }

        setInteractive(): void {

            this.getObject().setInteractive();
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            return new controls.viewers.IconImageCellRenderer(resources.getIcon(resources.ICON_SPINE));
        }

        writeJSON(data: ISpineObjectData): void {
            
            super.writeJSON(data);

            const obj = this.getObject();

            data.dataKey = obj.getDataKey();
            data.atlasKey = obj.getAtlasKey();
        }
    }

}