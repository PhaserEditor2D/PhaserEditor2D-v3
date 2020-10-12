namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ITilemapLayerData extends core.json.IObjectData {

        tilemapId: string;
        layerName: string;
        tilesets: string[]
    }

    export class DynamicTilemapLayerEditorSupport extends GameObjectEditorSupport<DynamicTilemapLayer> {

        constructor(obj: DynamicTilemapLayer, scene: Scene) {
            super(DynamicTilemapLayerExtension.getInstance(), obj, scene);

            StaticTilemapLayerEditorSupport.helper_init(this);
        }

        isUnlockedProperty(property: IProperty<any>) {

            if (property === TransformComponent.angle) {

                return false;
            }

            return super.isUnlockedProperty(property);
        }

        setInteractive(): void {

            this.getObject().setInteractive(StaticTilemapLayerEditorSupport.helper_interactiveCallback);
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            return new colibri.ui.controls.viewers.IconImageCellRenderer(ScenePlugin.getInstance().getIcon(ICON_TILEMAP_LAYER));
        }

        writeJSON(data: ITilemapLayerData) {

            super.writeJSON(data);

            StaticTilemapLayerEditorSupport.helper_writeJSON(this.getObject(), data);
        }
    }
}