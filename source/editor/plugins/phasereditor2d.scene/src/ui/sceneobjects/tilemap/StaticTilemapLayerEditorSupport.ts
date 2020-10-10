namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ITilemapLayerData extends core.json.IObjectData {

        tilemapId: string;
        layerName: string;
        tilesets: string[]
    }

    export class StaticTilemapLayerEditorSupport extends GameObjectEditorSupport<StaticTilemapLayer> {

        constructor(obj: StaticTilemapLayer, scene: Scene) {
            super(StaticTilemapLayerExtension.getInstance(), obj, scene);

            StaticTilemapLayerEditorSupport.helper_init(this);
        }

        destroy() {

            super.destroy();

            return true;
        }

        isUnlockedProperty(property: IProperty<any>) {

            if (property === TransformComponent.angle) {

                return false;
            }

            return super.isUnlockedProperty(property);
        }

        setInteractive(): void {

            this.getObject().setInteractive();
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            return new colibri.ui.controls.viewers.IconImageCellRenderer(ScenePlugin.getInstance().getIcon(ICON_TILEMAP_LAYER));
        }

        writeJSON(data: ITilemapLayerData) {

            super.writeJSON(data);

            StaticTilemapLayerEditorSupport.helper_writeJSON(this.getObject(), data);
        }


        static helper_writeJSON(layer: StaticTilemapLayer | DynamicTilemapLayer, data: ITilemapLayerData) {

            const tilemap = layer.tilemap as Tilemap;

            data.tilemapId = tilemap.getEditorSupport().getId();
            data.layerName = layer.layer.name;
            data.tilesets = tilemap.tilesets.map(t => t.name);
        }

        static helper_init(support: StaticTilemapLayerEditorSupport | DynamicTilemapLayerEditorSupport) {

            const obj = support.getObject();

            support.addComponent(

                new TransformComponent(obj as unknown as ITransformLikeObject),
                new VisibleComponent(obj as unknown as IVisibleLikeObject),
            );
        }
    }
}