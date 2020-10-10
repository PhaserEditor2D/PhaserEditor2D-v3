/// <reference path="./BaseTilemapLayerExtension.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class StaticTilemapLayerExtension extends BaseTilemapLayerExtension {

        private static _instance: StaticTilemapLayerExtension;

        static getInstance() {

            return this._instance ? this._instance : (this._instance = new StaticTilemapLayerExtension());
        }

        constructor() {
            super({
                iconName: ICON_TILEMAP_LAYER,
                phaserTypeName: "Phaser.Tilemaps.StaticTilemapLayer",
                typeName: "StaticTilemapLayer"
            });
        }

        createTilemapLayer(scene: Scene, tilemap: Tilemap, layerName: string) {

            return new StaticTilemapLayer(scene, tilemap, layerName);
        }

        getCodeFactoryMethod(): string {

            return "createStaticLayer";
        }
    }
}