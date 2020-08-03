namespace phasereditor2d.scene.core.json {

    export interface IObjectData {
        id: string;
        type?: string;
        prefabId?: string;
        components?: string[],
        label: string;
        unlock?: string[];
    }
}