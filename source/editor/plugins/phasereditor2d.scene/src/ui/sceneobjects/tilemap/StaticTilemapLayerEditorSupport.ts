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

        isUnlockedProperty(property: IProperty<any>) {

            if (property === TransformComponent.angle) {

                return false;
            }

            return super.isUnlockedProperty(property);
        }

        computeContentHash() {

            const obj = this.getObject();

            return obj.layer.name + "-TilemapLayer-" + obj.name;
        }

        setInteractive(): void {

            this.getObject().setInteractive(StaticTilemapLayerEditorSupport.helper_interactiveCallback);
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            //return new colibri.ui.controls.viewers.IconImageCellRenderer(pack.AssetPackPlugin.getInstance().getIcon(pack.ICON_TILEMAP_LAYER));

            return new ObjectCellRenderer();
        }

        writeJSON(data: ITilemapLayerData) {

            super.writeJSON(data);

            StaticTilemapLayerEditorSupport.helper_writeJSON(this.getObject(), data);
        }

        static helper_interactiveCallback(hitArea: any, x: number, y: number, layer: StaticTilemapLayer) {

            if (x >= 0 && y >= 0 && x <= layer.width && y <= layer.height) {

                const col = Math.floor(x / layer.layer.tileWidth);
                const row = Math.floor(y / layer.layer.tileHeight);

                const tile = layer.getTileAt(col, row);

                return tile !== null && tile !== undefined;
            }

            return false;
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

            support.setLabel(obj.layer.name);
        }
    }
}