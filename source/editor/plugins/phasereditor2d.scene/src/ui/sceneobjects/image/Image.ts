namespace phasereditor2d.scene.ui.sceneobjects {

    export class Image extends Phaser.GameObjects.Image implements ISceneGameObject {

        private _editorSupport: ImageEditorSupport;

        constructor(
            scene: Scene, x: number, y: number, texture: string, frame?: string | number) {

            super(scene, x, y, texture, frame);

            this._editorSupport = new ImageEditorSupport(this, scene);
        }

        getEditorSupport(): ImageEditorSupport {

            return this._editorSupport;
        }
    }
}