/// <reference path="../Component.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ITransformLikeObject extends ISceneGameObject {

        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        angle: number;
    }

    export class TransformComponent extends Component<ITransformLikeObject> {

        static x = SimpleProperty("x", 0, "X", "phaser:Phaser.GameObjects.Components.Transform.x", false, null, 1);
        static y = SimpleProperty("y", 0, "Y", "phaser:Phaser.GameObjects.Components.Transform.y", false, null, 1);

        static position: IPropertyXY = {
            label: "Position",
            tooltip: "phaser:Phaser.GameObjects.Components.Transform.setPosition",
            x: TransformComponent.x,
            y: TransformComponent.y
        };

        static scaleX = SimpleProperty("scaleX", 1, "X", "phaser:Phaser.GameObjects.Components.Transform.scaleX", false, null, 0.05);
        static scaleY = SimpleProperty("scaleY", 1, "Y", "phaser:Phaser.GameObjects.Components.Transform.scaleY", false, null, 0.05);

        static scale: IPropertyXY = {
            label: "Scale",
            x: TransformComponent.scaleX,
            y: TransformComponent.scaleY
        };

        static angle = SimpleProperty("angle", 0, "Angle", "phaser:Phaser.GameObjects.Components.Transform.angle", false, null, 1);

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