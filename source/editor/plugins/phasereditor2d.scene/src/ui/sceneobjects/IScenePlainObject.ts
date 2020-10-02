namespace phasereditor2d.scene.ui.sceneobjects {

    export interface IScenePlainObject {

        getEditorSupport(): ScenePlainObjectEditorSupport<any>;
    }
}