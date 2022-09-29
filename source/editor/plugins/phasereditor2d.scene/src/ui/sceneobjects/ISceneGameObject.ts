namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ISceneGameObject extends Phaser.GameObjects.GameObject {

        getEditorSupport(): GameObjectEditorSupport<ISceneGameObject>;
    }
}