namespace phasereditor2d.scene.ui.sceneobjects {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;

    export declare interface IOriginLike {
        originX: number;
        originY: number;
    }

    export class OriginComponent implements json.Serializable {

        private _obj: IOriginLike;

        constructor(obj: IOriginLike) {
            this._obj = obj;
        }

        readJSON(ser: json.Serializer) {

            this._obj.originX = ser.read("originX", 0.5);
            this._obj.originY = ser.read("originY", 0.5);
        }

        writeJSON(ser: json.Serializer) {

            ser.write( "originX", this._obj.originX, 0.5);
            ser.write( "originY", this._obj.originY, 0.5);
        }
    }
}