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

        static x = SimpleProperty("x", 0, "X");
        static y = SimpleProperty("y", 0, "Y");

        static position: IPropertyXY = {
            label: "Position",
            x: TransformComponent.x,
            y: TransformComponent.y
        };

        static scaleX = SimpleProperty("scaleX", 1, "X");
        static scaleY = SimpleProperty("scaleY", 1, "Y");

        static scale: IPropertyXY = {
            label: "Scale",
            x: TransformComponent.scaleX,
            y: TransformComponent.scaleY
        };

        static angle = SimpleProperty("angle", 0, "Angle");

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            const obj = this.getObject();

            this.buildSetObjectPropertyCodeDOM_Float("scaleX", obj.scaleX, 1, args);
            this.buildSetObjectPropertyCodeDOM_Float("scaleY", obj.scaleY, 1, args);
            this.buildSetObjectPropertyCodeDOM_Float("angle", obj.angle, 0, args);
        }

        readJSON(ser: json.Serializer) {

            this.readLocal(ser,
                TransformComponent.x,
                TransformComponent.y
            );

            this.read(ser,
                TransformComponent.scaleX,
                TransformComponent.scaleY,
                TransformComponent.angle
            );
        }

        writeJSON(ser: json.Serializer) {

            this.writeLocal(ser,
                TransformComponent.x,
                TransformComponent.y
            );

            this.write(ser,
                TransformComponent.scaleX,
                TransformComponent.scaleY,
                TransformComponent.angle
            );
        }
    }
}