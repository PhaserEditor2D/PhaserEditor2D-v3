namespace phasereditor2d.scene.core.json {

    export interface ISerializable {

        writeJSON(ser: Serializer): void;

        readJSON(ser: Serializer): void;
    }
}