namespace phasereditor2d.scene.ui.sceneobjects {

    export class Tilemap extends Phaser.Tilemaps.Tilemap implements IScenePlainObject {

        private _key: string;

        static createTilemapData(scene: Scene, key: string) {

            const tilemapData = scene.cache.tilemap.get(key);

            if (tilemapData) {

                const mapData = Phaser.Tilemaps.Parsers.Parse(key, tilemapData.format, tilemapData.data, undefined, undefined, undefined);

                return mapData;
            }

            return new Phaser.Tilemaps.MapData();
        }

        static getTilemapLayerNames(scene: Scene, key: string) {

            const data = this.createTilemapData(scene, key);

            if (data.layers instanceof Phaser.Tilemaps.ObjectLayer) {

                return [data.layers.name];
            }

            return data.layers.map(layer => layer.name);
        }

        private _editorSupport: TilemapEditorSupport;

        constructor(scene: Scene, key: string) {
            super(scene, Tilemap.createTilemapData(scene, key));

            this._key = key;
            this._editorSupport = new TilemapEditorSupport(scene, this);

            for (const tileset of this.tilesets) {

                tileset["__tilemap"] = this;
            }
        }

        static getTilemapFromTileset(tileset: Phaser.Tilemaps.Tileset) {

            return tileset["__tilemap"] as Tilemap;
        }

        getTilemapAssetKey() {
            return this._key;
        }

        getEditorSupport() {

            return this._editorSupport;
        }
    }
}