/// <reference path="../Component.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export interface IOriginLikeObject extends ISceneGameObject {

        originX: number;
        originY: number;
        setOrigin(x: number, y: number);
    }

    export class OriginComponent extends Component<IOriginLikeObject> {

        static originX: IProperty<IOriginLikeObject> = {
            name: "originX",
            label: "X",
            tooltip: "phaser:Phaser.GameObjects.Components.Origin.originX",
            defValue: 0.5,
            getValue: obj => obj.originX,
            setValue: (obj, value) => obj.setOrigin(value, obj.originY)
        };

        static originY: IProperty<IOriginLikeObject> = {
            name: "originY",
            label: "Y",
            tooltip: "phaser:Phaser.GameObjects.Components.Origin.originY",
            defValue: 0.5,
            getValue: obj => obj.originY,
            setValue: (obj, value) => obj.setOrigin(obj.originX, value)
        };

        static origin: IPropertyXY = {
            label: "Origin",
            tooltip: "phaser:Phaser.GameObjects.Components.Origin.setOrigin",
            x: OriginComponent.originX,
            y: OriginComponent.originY
        };

        constructor(obj: IOriginLikeObject) {
            super(obj, [
                OriginComponent.originX,
                OriginComponent.originY
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            const obj = this.getObject();

            let add = false;

            if (obj.getEditorSupport().isUnlockedPropertyXY(OriginComponent.origin)) {

                add = true;

            } else {

                const originXDefault = this.getPropertyDefaultValue(OriginComponent.originX);
                const originYDefault = this.getPropertyDefaultValue(OriginComponent.originY);

                add = obj.originX !== originXDefault || obj.originY !== originYDefault;
            }

            if (add) {

                const dom = new code.MethodCallCodeDOM("setOrigin", args.objectVarName);

                dom.argFloat(obj.originX);
                dom.argFloat(obj.originY);

                args.statements.push(dom);
            }
        }
    }
}