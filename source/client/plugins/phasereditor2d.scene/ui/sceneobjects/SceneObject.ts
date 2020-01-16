namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ISceneObject extends

        ISceneObjectLike,

        Phaser.GameObjects.GameObject {

        getEditorSupport(): EditorSupport<ISceneObject>;
    }
}