namespace phasereditor2d.scene.ui.sceneobjects {

    export class TilemapLayer extends Phaser.Tilemaps.TilemapLayer implements ISceneGameObject {

        private _editorSupport: StaticTilemapLayerEditorSupport;

        constructor(scene: Scene, tilemap: Tilemap, layerName: string) {
            super(scene, tilemap, tilemap.getLayerIndex(layerName), tilemap.tilesets);

            this.setRenderOrder(tilemap.renderOrder);
            this.setOrigin(0, 0);

            this._editorSupport = new StaticTilemapLayerEditorSupport(this, scene);
        }

        static scanTilesets(layer: TilemapLayer) {

            const gidMap = new Map();

            const allTilesets = layer.tilemap.tilesets;

            for (const tileset of allTilesets) {

                const s = tileset.firstgid;

                for (let t = 0; t < tileset.total; t++) {

                    gidMap.set(s + t, tileset);
                }
            }

            const layerTilesets = new Set<Phaser.Tilemaps.Tileset>();

            for (let x = 0; x < layer.width; x++) {

                for (let y = 0; y < layer.height; y++) {

                    const tile = layer.getTileAt(x, y);

                    if (tile) {

                        const tileset = gidMap.get(tile.index);

                        if (tileset) {

                            layerTilesets.add(tileset);
                        }
                    }
                }
            }

            return [...layerTilesets];
        }

        destroy() {

            super.destroy(false);
        }


        getEditorSupport(): StaticTilemapLayerEditorSupport {

            return this._editorSupport;
        }
    }
}