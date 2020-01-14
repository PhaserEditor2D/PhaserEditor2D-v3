/// <reference path="../Component.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;

    export declare interface IOriginLike extends SceneObject {

        originX: number;
        originY: number;
    }

    export class OriginComponent extends Component<IOriginLike> {

        static originX = SimpleProperty("originX", 0.5, "X");

        static originY = SimpleProperty("originY", 0.5, "Y");

        static origin: IPropertyXY = {
            label: "Origin",
            x: OriginComponent.originX,
            y: OriginComponent.originY
        };

        buildSetObjectPropertiesCodeDOM(args: SetObjectPropertiesCodeDOMArgs): void {

            const obj = this.getObject();

            this.buildSetObjectPropertyCodeDOM_Float("originX", obj.originX, 0.5, args);
            this.buildSetObjectPropertyCodeDOM_Float("originY", obj.originY, 0.5, args);
        }

        readJSON(ser: json.Serializer) {

            const obj = this.getObject();

            obj.originX = ser.read("originX", 0.5);
            obj.originY = ser.read("originY", 0.5);
        }

        writeJSON(ser: json.Serializer) {

            const obj = this.getObject();

            ser.write("originX", obj.originX, 0.5);
            ser.write("originY", obj.originY, 0.5);
        }
    }
}