namespace phasereditor2d.scene.ui.json {

    export interface JSONSerializer {

        writeJSON(data: any): void;

        readJSON(data: any): void;
    }
}