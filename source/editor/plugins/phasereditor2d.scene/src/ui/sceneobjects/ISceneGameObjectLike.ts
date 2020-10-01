namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ISceneGameObjectLike {

        getEditorSupport(): GameObjectEditorSupport<ISceneGameObject>;
    }
}