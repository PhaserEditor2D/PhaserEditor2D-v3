namespace phasereditor2d.scene.ui.sceneobjects {

    export class TileSprite extends Phaser.GameObjects.TileSprite implements ISceneGameObject {

        private _editorSupport: TileSpriteEditorSupport;

        constructor(
            scene: Scene, x: number, y: number, width: number, height: number,
            texture: string, frame: string | number
        ) {
            super(scene, x, y, width, height, texture, frame);

            this._editorSupport = new TileSpriteEditorSupport(this, scene);
        }

        getEditorSupport(): GameObjectEditorSupport<ISceneGameObject> {
            
            return this._editorSupport;
        }
    }
}