namespace phasereditor2d.scene.ui.sceneobjects {

    export class StaticTilemapLayer extends Phaser.Tilemaps.StaticTilemapLayer implements ISceneGameObject {

        private _editorSupport: StaticTilemapLayerEditorSupport;

        constructor(scene: Scene, tilemap: Tilemap, layerName: string) {
            super(scene, tilemap, tilemap.getLayerIndex(layerName), tilemap.tilesets);

            this.setRenderOrder(tilemap.renderOrder);
            this.setOrigin(0, 0);

            this._editorSupport = new StaticTilemapLayerEditorSupport(this, scene);
        }

        destroy() {

            super.destroy(false);
        }


        getEditorSupport(): StaticTilemapLayerEditorSupport {

            return this._editorSupport;
        }
    }
}