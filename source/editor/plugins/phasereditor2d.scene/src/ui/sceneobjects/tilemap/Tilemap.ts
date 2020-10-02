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

        private _editorSupport: TilemapEditorSupport;

        constructor(scene: Scene, key: string) {
            super(scene, Tilemap.createTilemapData(scene, key));

            this._key = key;
            this._editorSupport = new TilemapEditorSupport(scene, this);
        }

        getTilemapAssetKey() {
            return this._key;
        }

        getEditorSupport() {

            return this._editorSupport;
        }
    }
}