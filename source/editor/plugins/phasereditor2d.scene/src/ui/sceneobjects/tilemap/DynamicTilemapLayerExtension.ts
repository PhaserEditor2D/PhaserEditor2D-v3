/// <reference path="./BaseTilemapLayerExtension.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class DynamicTilemapLayerExtension extends BaseTilemapLayerExtension {

        private static _instance: DynamicTilemapLayerExtension;

        static getInstance() {

            return this._instance ? this._instance : (this._instance = new DynamicTilemapLayerExtension());
        }

        constructor() {
            super({
                icon: pack.AssetPackPlugin.getInstance().getIconDescriptor(pack.ICON_TILEMAP_LAYER),
                phaserTypeName: "Phaser.Tilemaps.DynamicTilemapLayer",
                typeName: "DynamicTilemapLayer",
                category: SCENE_OBJECT_TILEMAP_CATEGORY,
            });
        }

        createTilemapLayer(scene: Scene, tilemap: Tilemap, layerName: string) {

            return new DynamicTilemapLayer(scene, tilemap, layerName);
        }

        getCodeFactoryMethod(): string {

            return "createDynamicLayer";
        }
    }
}