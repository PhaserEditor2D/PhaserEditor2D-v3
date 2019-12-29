namespace phasereditor2d.scene.ui.sceneobjects {

    export class Image extends Phaser.GameObjects.Image implements SceneObject {

        private _editorSupport: ImageEditorSupport;

        constructor(scene: GameScene, x: number, y: number, texture: string, frame?: string | number) {
            super(scene, x, y, texture, frame);

            this._editorSupport = new ImageEditorSupport(this);
        }

        getEditorSupport(): ImageEditorSupport {
            return this._editorSupport;
        }

        writeJSON(data: any) {

            data.type = "Image";

            json.ObjectComponent.write(this, data);

            json.VariableComponent.write(this, data);

            json.TransformComponent.write(this, data);

            json.TextureComponent.write(this, data);
        }

        readJSON(data: any) {

            json.ObjectComponent.read(this, data);

            json.VariableComponent.read(this, data);

            json.TransformComponent.read(this, data);

            json.TextureComponent.read(this, data);
        }

        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera) {
            return getScreenBounds(this, camera);
        }
    }
}