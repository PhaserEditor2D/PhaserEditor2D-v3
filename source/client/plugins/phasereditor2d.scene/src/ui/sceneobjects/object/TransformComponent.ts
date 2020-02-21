/// <reference path="../Component.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ITransformLikeObject extends ISceneObjectLike {

        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        angle: number;
    }

    export class TransformComponent extends Component<ITransformLikeObject> {

        static x = SimpleProperty("x", 0, "X", undefined, true);
        static y = SimpleProperty("y", 0, "Y", undefined, true);

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

        constructor(obj: ITransformLikeObject) {
            super(obj, [
                TransformComponent.x,
                TransformComponent.y,
                TransformComponent.scaleX,
                TransformComponent.scaleY,
                TransformComponent.angle
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM_FloatProperty(
                args,
                TransformComponent.scaleX,
                TransformComponent.scaleY,
                TransformComponent.angle
            );
        }
    }
}