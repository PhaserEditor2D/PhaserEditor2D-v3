/// <reference path="../Component.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;
    import json = core.json;

    export interface ITransformLike extends ISceneObjectLike {

        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        angle: number;
    }

    export class TransformComponent extends Component<ITransformLike> {

        static x: IProperty<ITransformLike> = {
            name: "x",
            defValue: 0,
            getValue: obj => obj.x,
            setValue: (obj, val) => obj.x = val,
        };

        static y: IProperty<ITransformLike> = {
            name: "y",
            defValue: 0,
            getValue: obj => obj.y,
            setValue: (obj, val) => obj.y = val,
        };

        static scaleX: IProperty<ITransformLike> = {
            name: "scaleX",
            defValue: 1,
            getValue: obj => obj.scaleX,
            setValue: (obj, val) => obj.scaleX = val,
        };

        static scaleY: IProperty<ITransformLike> = {
            name: "scaleY",
            defValue: 1,
            getValue: obj => obj.scaleY,
            setValue: (obj, val) => obj.scaleY = val
        };

        static angle: IProperty<ITransformLike> = {
            name: "angle",
            defValue: 0,
            getValue: obj => obj.angle,
            setValue: (obj, val) => obj.angle = val,
        };

        buildSetObjectPropertiesCodeDOM(args: SetObjectPropertiesCodeDOMArgs): void {

            const obj = this.getObject();

            this.buildSetObjectPropertyCodeDOM_Float("scaleX", obj.scaleX, 1, args);
            this.buildSetObjectPropertyCodeDOM_Float("scaleY", obj.scaleY, 1, args);
            this.buildSetObjectPropertyCodeDOM_Float("angle", obj.angle, 0, args);
        }

        readJSON(ser: json.Serializer) {

            const obj = this.getObject();

            // position are always unlocked!

            obj.x = read(ser.getData(), "x", 0);
            obj.y = read(ser.getData(), "y", 0);

            obj.scaleX = ser.read("scaleX", 1);
            obj.scaleY = ser.read("scaleY", 1);
            obj.angle = ser.read("angle", 0);
        }

        writeJSON(ser: json.Serializer) {

            const obj = this.getObject();

            // position is always unlocked

            write(ser.getData(), "x", obj.x, 0);
            write(ser.getData(), "y", obj.y, 0);

            ser.write("scaleX", obj.scaleX, 1);
            ser.write("scaleY", obj.scaleY, 1);
            ser.write("angle", obj.angle, 0);
        }
    }
}