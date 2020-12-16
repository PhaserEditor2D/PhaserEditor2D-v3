namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ISceneGameObject extends

        ISceneGameObjectLike,

        Phaser.GameObjects.GameObject {

        getEditorSupport(): GameObjectEditorSupport<ISceneGameObject>;
    }
}