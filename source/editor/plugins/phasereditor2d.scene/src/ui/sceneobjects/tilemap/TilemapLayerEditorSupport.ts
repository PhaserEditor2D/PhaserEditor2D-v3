namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ITilemapLayerData extends core.json.IObjectData {

        tilemapId: string;
        layerName: string;
        tilesets: string[]
    }

    export class TilemapLayerEditorSupport extends GameObjectEditorSupport<TilemapLayer> {

        constructor(obj: TilemapLayer, scene: Scene) {
            super(TilemapLayerExtension.getInstance(), obj, scene);

            this.addComponent(

                new TransformComponent(obj as unknown as ITransformLikeObject),
                new VisibleComponent(obj as unknown as IVisibleLikeObject),
            );

            this.setLabel(obj.layer.name);
        }

        getScreenBoundsOrigin() {

            if (this.getOrientation() === Phaser.Tilemaps.Orientation.ISOMETRIC) {

                return { originX: 0.5, originY: 0 };
            }

            return super.getScreenBoundsOrigin();
        }

        isUnlockedProperty(property: IProperty<any>) {

            if (property === TransformComponent.angle) {

                return false;
            }

            return super.isUnlockedProperty(property);
        }

        computeContentHash() {

            const obj = this.getObject();

            const tilesetHash = obj.tileset.map(t => t.image).filter(img => img).map(img => img.key);

            return (obj.tilemap as Tilemap).getEditorSupport().getId() + "-" + obj.layer.name + "-" + tilesetHash;
        }

        setInteractive(): void {

            this.getObject().setInteractive(TilemapLayerEditorSupport.helper_interactiveCallback);
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            return new ObjectCellRenderer();
        }

        writeJSON(data: ITilemapLayerData) {

            super.writeJSON(data);

            const layer = this.getObject();

            const tilemap = layer.tilemap as Tilemap;

            data.tilemapId = tilemap.getEditorSupport().getId();
            data.layerName = layer.layer.name;
            data.tilesets = tilemap.tilesets.map(t => t.name);
        }

        getOrientation() {

            return this.getObject().tilemap.orientation as any as Phaser.Tilemaps.Orientation;
        }

        static helper_interactiveCallback(hitArea: any, x: number, y: number, layer: TilemapLayer) {

            if (x >= -layer.width && y >= -layer.height && x <= layer.width && y <= layer.height) {

                let worldToTile: (worldX: number, worldY: number, layer: Phaser.Tilemaps.LayerData) => { tileX: number, tileY: number };

                const orientation = layer.tilemap.orientation as any as number;

                if (orientation === Phaser.Tilemaps.Orientation.ISOMETRIC) {

                    worldToTile = TilemapLayerEditorSupport.isometricWorldToTileXY;

                } else {

                    worldToTile = TilemapLayerEditorSupport.worldToTileXY;
                }

                const { tileX, tileY } = worldToTile(x, y, layer.tilemap.layer);

                const tile = layer.getTileAt(tileX, tileY);

                return tile !== null && tile !== undefined;
            }

            return false;
        }

        private static worldToTileXY(worldX: number, worldY: number, layer: Phaser.Tilemaps.LayerData) {

            const tilemapLayer = layer.tilemapLayer;

            const tileX = Math.floor(worldX / layer.baseTileWidth * tilemapLayer.scaleX);
            const tileY = Math.floor(worldY / layer.baseTileHeight * tilemapLayer.scaleY)

            return { tileX, tileY };
        };

        private static isometricWorldToTileXY(worldX: number, worldY: number, layer: Phaser.Tilemaps.LayerData) {

            let tileWidth = layer.baseTileWidth;
            let tileHeight = layer.baseTileHeight;
            const tilemapLayer = layer.tilemapLayer;

            tileHeight *= tilemapLayer.scaleY;
            tileWidth *= tilemapLayer.scaleX;

            worldX -= tileWidth / 2;

            const tileX = Math.floor((worldX / (tileWidth / 2) + worldY / (tileHeight / 2)) / 2);
            const tileY = Math.floor((worldY / (tileHeight / 2) - worldX / (tileWidth / 2)) / 2);

            return { tileX, tileY };
        };
    }
}