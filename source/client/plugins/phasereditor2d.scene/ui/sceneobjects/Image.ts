namespace phasereditor2d.scene.ui.sceneobjects {

    export class Image extends Phaser.GameObjects.Image implements SceneObject {

        private _editorSupport: ImageEditorSupport;

        constructor(
            extension: ImageExtension,
            scene: GameScene, x: number, y: number, texture: string, frame?: string | number) {

            super(scene, x, y, texture, frame);

            this._editorSupport = new ImageEditorSupport(extension, this);
        }

        getEditorSupport(): ImageEditorSupport {
            return this._editorSupport;
        }

        writeJSON(data: any) {

            this._editorSupport.writeJSON(data);
        }

        readJSON(data: any) {

            this._editorSupport.readJSON(data);
        }

        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera) {
            return getScreenBounds(this, camera);
        }
    }
}