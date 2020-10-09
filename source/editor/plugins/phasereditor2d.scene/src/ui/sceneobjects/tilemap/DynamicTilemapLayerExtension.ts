/// <reference path="./BaseTilemapLayerExtension.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class DynamicTilemapLayerExtension extends BaseTilemapLayerExtension {

        private static _instance: DynamicTilemapLayerExtension;

        static getInstance() {

            return this._instance ? this._instance : (this._instance = new DynamicTilemapLayerExtension());
        }

        constructor() {
            super({
                iconName: ICON_TILEMAP_LAYER,
                phaserTypeName: "Phaser.Tilemaps.DynamicTilemapLayer",
                typeName: "DynamicTilemapLayer"
            });
        }

        createTilemapLayer(scene: Scene, tilemap: Tilemap, layerName: string): ISceneGameObject {

            return new DynamicTilemapLayer(scene, tilemap, layerName);
        }

        getCodeFactoryMethod(): string {

            return "createDynamicLayer";
        }
    }
}