namespace phasereditor2d.scene.core.json {

    export interface IScenePlainObjectData {
        id: string;
        type: string;
        scope?: ui.sceneobjects.ObjectScope;
        label: string;
    }
}