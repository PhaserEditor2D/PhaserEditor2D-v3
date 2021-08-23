/// <reference path="../Component.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ITransformLikeObject extends ISceneGameObjectLike {

        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        angle: number;
    }

    export class TransformComponent extends Component<ITransformLikeObject> {

        static x = SimpleProperty("x", 0, "X", "phaser:Phaser.GameObjects.Components.Transform.x");
        static y = SimpleProperty("y", 0, "Y", "phaser:Phaser.GameObjects.Components.Transform.y");

        static position: IPropertyXY = {
            label: "Position",
            tooltip: "phaser:Phaser.GameObjects.Components.Transform.setPosition",
            x: TransformComponent.x,
            y: TransformComponent.y
        };

        static scaleX = SimpleProperty("scaleX", 1, "X", "phaser:Phaser.GameObjects.Components.Transform.scaleX");
        static scaleY = SimpleProperty("scaleY", 1, "Y", "phaser:Phaser.GameObjects.Components.Transform.scaleY");

        static scale: IPropertyXY = {
            label: "Scale",
            x: TransformComponent.scaleX,
            y: TransformComponent.scaleY
        };

        static angle = SimpleProperty("angle", 0, "Angle", "phaser:Phaser.GameObjects.Components.Transform.angle");

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

            const obj = this.getObject();
            const support = obj.getEditorSupport();
            const prop = TransformComponent.position;

            if (support.isNestedPrefabInstance()
                && support.isUnlockedPropertyXY(prop)) {

                const dom = new core.code.MethodCallCodeDOM("setPosition", args.objectVarName);
                dom.argFloat(prop.x.getValue(obj));
                dom.argFloat(prop.y.getValue(obj));
                args.statements.push(dom);
            }

            this.buildSetObjectPropertyCodeDOM_FloatProperty(
                args,
                TransformComponent.scaleX,
                TransformComponent.scaleY,
                TransformComponent.angle
            );
        }
    }
}