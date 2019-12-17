namespace phasereditor2d.scene.ui.json {

    export interface ReadWriteJSON {

        writeJSON(data: any): void;

        readJSON(data: any): void;
    }
}