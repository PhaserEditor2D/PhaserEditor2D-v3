namespace phasereditor2d.scene.core.json {

    export interface IObjectListsData {

        lists: IObjectListData[];
    }

    export interface IObjectListData {

        id: string;
        label: string;
        scope?: ui.sceneobjects.ObjectScope;
        objectIds?: string[];
    }
}