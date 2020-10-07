namespace phasereditor2d.scene.ui.sceneobjects {

    export class TilemapLayer extends Phaser.Tilemaps.StaticTilemapLayer implements ISceneGameObject {

        private _editorSupport: TilemapLayerEditorSupport;

        constructor(scene: Scene, tilemap: Tilemap, layerName: string) {
            super(scene, tilemap, tilemap.getLayerIndex(layerName), tilemap.tilesets);

            this.setRenderOrder(tilemap.renderOrder);
            this.setOrigin(0, 0);

            this._editorSupport = new TilemapLayerEditorSupport(this, scene);
        }


        getEditorSupport(): TilemapLayerEditorSupport {

            return this._editorSupport;
        }
    }
}