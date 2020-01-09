/// <reference path="../Component.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;
    import json = core.json;

    export declare interface ITransformLike {

        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        angle: number;
    }

    export class TransformComponent extends Component<ITransformLike> {

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