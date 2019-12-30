namespace phasereditor2d.scene.ui.json {

    export interface ObjectSerializer {

        writeJSON(data: ObjectData): void;

        readJSON(data: ObjectData): void;
    }
}