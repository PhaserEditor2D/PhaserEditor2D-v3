namespace phasereditor2d.scene.ui.sceneobjects {

    export class TilemapExtension extends ScenePlainObjectExtension {

        static CATEGORY = "Tilemap";
        private static _instance: TilemapExtension;

        static getInstance(): ScenePlainObjectExtension {

            return this._instance ?? (this._instance = new TilemapExtension());
        }

        private constructor() {
            super({
                category: TilemapExtension.CATEGORY,
                iconName: ICON_GROUP,
                phaserTypeName: "Phaser.Tilemaps.Tilemap",
                typeName: "Tilemap"
            });
        }
    }
}