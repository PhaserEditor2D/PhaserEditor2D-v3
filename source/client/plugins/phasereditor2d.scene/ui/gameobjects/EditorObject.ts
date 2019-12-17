namespace phasereditor2d.scene.ui.gameobjects {

    export interface EditorObject extends

        Phaser.GameObjects.GameObject,

        json.ReadWriteJSON {

        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera);
    }

    export interface EditorObject extends EditorObjectMixin {

    }

}