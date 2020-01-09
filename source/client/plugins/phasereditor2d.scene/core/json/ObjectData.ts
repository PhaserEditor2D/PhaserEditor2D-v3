namespace phasereditor2d.scene.core.json {

    export interface ObjectData {
        id: string;
        type?: string;
        prefabId?: string;
        label: string;
        unlock?: string[];
    }
}