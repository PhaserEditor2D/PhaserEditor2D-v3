namespace phasereditor2d.scene.core.json {

    export interface IObjectListData {

        id: string;
        label: string;
        scope?: ui.sceneobjects.ObjectScope;
        objectIds?: string[];
    }
}