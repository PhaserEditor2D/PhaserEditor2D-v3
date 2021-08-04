namespace phasereditor2d.scene.core.json {

    export interface IObjectData {
        id: string;
        type?: string;
        prefabId?: string;
        isNestedPrefab?:boolean;
        components?: string[],
        label: string;
        unlock?: string[];
        scope?: ui.sceneobjects.ObjectScope;
        list?: IObjectData[];
        nestedPrefabs?: IObjectData[];
    }
}