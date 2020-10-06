namespace phasereditor2d.scene.ui.sceneobjects {

    export class TilemapLayer extends Phaser.Tilemaps.StaticTilemapLayer implements ISceneGameObject {

        private _editorSupport: TilemapLayerEditorSupport;

        constructor(scene: Scene, tilemap: Tilemap, layerID: string) {
            super(scene, tilemap, tilemap.getLayerIndex(layerID), tilemap.tilesets);

            this.setRenderOrder(tilemap.renderOrder);

            this._editorSupport = new TilemapLayerEditorSupport(this, scene);
        }


        getEditorSupport(): GameObjectEditorSupport<ISceneGameObject> {

            return this._editorSupport;
        }
    }
}