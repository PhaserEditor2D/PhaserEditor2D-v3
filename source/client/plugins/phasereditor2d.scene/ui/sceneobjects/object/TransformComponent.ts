namespace phasereditor2d.scene.ui.sceneobjects {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;

    export declare interface ITransformLike {
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        angle: number;
    }

    export class TransformComponent implements json.Serializable {

        private _obj: ITransformLike;

        constructor(obj: ITransformLike) {
            this._obj = obj;
        }

        readJSON(ser: json.Serializer) {

            this._obj.x = ser.read("x", 0);
            this._obj.y = ser.read("y", 0);

            this._obj.scaleX = ser.read("scaleX", 1);
            this._obj.scaleY = ser.read("scaleY", 1);
            this._obj.angle = ser.read("angle", 0);
        }

        writeJSON(ser: json.Serializer) {

            ser.write("x", this._obj.x, 0);
            ser.write("y", this._obj.y, 0);
            ser.write("scaleX", this._obj.scaleX, 1);
            ser.write("scaleY", this._obj.scaleY, 1);
            ser.write("angle", this._obj.angle, 0);
        }
    }
}