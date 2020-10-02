namespace phasereditor2d.scene.ui.sceneobjects {

    export class TilemapExtension extends ScenePlainObjectExtension {

        static CATEGORY = "Tilemap";
        static POINT_ID = "phasereditor2d.scene.ui.sceneobjects.TilemapExtension";
        private static _instance: TilemapExtension;

        static getInstance(): ScenePlainObjectExtension {

            return this._instance ?? (this._instance = new TilemapExtension());
        }

        private constructor() {
            super({
                id: TilemapExtension.POINT_ID,
                category: TilemapExtension.CATEGORY,
                iconName: ICON_GROUP,
                phaserTypeName: "Phaser.Tilemaps.Tilemap",
                typeName: "Tilemap"
            });
        }
    }
}