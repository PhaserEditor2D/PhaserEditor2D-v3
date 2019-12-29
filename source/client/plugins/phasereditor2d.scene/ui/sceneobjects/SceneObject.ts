namespace phasereditor2d.scene.ui.sceneobjects {

    export interface SceneObject extends

        Phaser.GameObjects.GameObject,

        json.ReadWriteJSON {

        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera);

        getEditorSupport(): EditorSupport;
    }
}