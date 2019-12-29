/// <reference path="./EditorObjectMixin.ts" />

namespace phasereditor2d.scene.ui.gameobjects {

    export class EditorImage extends Phaser.GameObjects.Image implements EditorObject {

        writeJSON(data: any) {

            data.type = "Image";

            json.ObjectComponent.write(this, data);

            json.VariableComponent.write(this, data);

            json.TransformComponent.write(this, data);

            json.TextureComponent.write(this, data);
        };

        readJSON(data: any) {

            json.ObjectComponent.read(this, data);

            json.VariableComponent.read(this, data);

            json.TransformComponent.read(this, data);

            json.TextureComponent.read(this, data);
        }

        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera) {
            return getScreenBounds(this, camera);
        }

        setEditorTexture(key: string, frame: any) {

            this.setData("textureKey", key);
            this.setData("textureFrameKey", frame);
        }

        getEditorTexture() {

            return {
                key: this.getData("textureKey"),
                frame: this.getData("textureFrameKey")
            };
        }
    }

    export interface EditorImage extends EditorObjectMixin {
        // empty
    }

    colibri.lang.applyMixins(EditorImage, [EditorObjectMixin]);
}