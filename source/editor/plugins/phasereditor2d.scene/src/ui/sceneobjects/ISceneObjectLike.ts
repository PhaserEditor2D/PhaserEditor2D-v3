namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ISceneObjectLike {

        getEditorSupport(): EditorSupport<ISceneObject>;
    }
}