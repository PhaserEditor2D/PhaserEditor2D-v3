namespace phasereditor2d.scene.core.json {

    export interface IObjectData {
        id: string;
        type?: string;
        prefabId?: string;
        components?: string[],
        label: string;
        displayName?: string;
        unlock?: string[];
        scope?: ui.sceneobjects.ObjectScope;
        private_np?: boolean;
        list?: IObjectData[];
        nestedPrefabs?: IObjectData[];
    }
}