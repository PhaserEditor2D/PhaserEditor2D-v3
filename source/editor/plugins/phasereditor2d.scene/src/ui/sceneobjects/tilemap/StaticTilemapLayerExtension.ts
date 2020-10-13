/// <reference path="./BaseTilemapLayerExtension.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class StaticTilemapLayerExtension extends BaseTilemapLayerExtension {

        private static _instance: StaticTilemapLayerExtension;

        static getInstance() {

            return this._instance ? this._instance : (this._instance = new StaticTilemapLayerExtension());
        }

        constructor() {
            super({
                icon: pack.AssetPackPlugin.getInstance().getIconDescriptor(pack.ICON_TILEMAP_LAYER),
                phaserTypeName: "Phaser.Tilemaps.StaticTilemapLayer",
                typeName: "StaticTilemapLayer"
            });
        }

        createTilemapLayer(scene: Scene, tilemap: Tilemap, layerName: string) {

            const layer = new StaticTilemapLayer(scene, tilemap, layerName);

            return layer;
        }

        getCodeFactoryMethod(): string {

            return "createStaticLayer";
        }
    }
}