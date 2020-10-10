namespace phasereditor2d.scene.ui.sceneobjects {

    export class DynamicTilemapLayer extends Phaser.Tilemaps.DynamicTilemapLayer {

        private _editorSupport: DynamicTilemapLayerEditorSupport;

        constructor(scene: Scene, tilemap: Tilemap, layerName: string) {
            super(scene, tilemap, tilemap.getLayerIndex(layerName), tilemap.tilesets);

            this.setRenderOrder(tilemap.renderOrder);
            this.setOrigin(0, 0);
            this.setSkipCull(true);

            this._editorSupport = new DynamicTilemapLayerEditorSupport(this, scene);
        }


        getEditorSupport(): DynamicTilemapLayerEditorSupport {

            return this._editorSupport;
        }
    }
}