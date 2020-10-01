namespace phasereditor2d.scene.ui.sceneobjects {

    export class Sprite extends Phaser.GameObjects.Image implements ISceneGameObject {

        private _editorSupport: SpriteEditorSupport;

        constructor(
            scene: Scene, x: number, y: number, texture: string, frame?: string | number) {

            super(scene, x, y, texture, frame);

            this._editorSupport = new SpriteEditorSupport(this, scene);
        }

        getEditorSupport(): SpriteEditorSupport {

            return this._editorSupport;
        }
    }
}