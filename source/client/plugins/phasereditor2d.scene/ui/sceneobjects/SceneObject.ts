namespace phasereditor2d.scene.ui.sceneobjects {

    export interface SceneObject extends

        Phaser.GameObjects.GameObject {

        getEditorSupport(): EditorSupport<SceneObject>;
    }
}