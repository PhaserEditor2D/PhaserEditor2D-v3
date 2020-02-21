/// <reference path="../Component.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export interface IOriginLikeObject extends ISceneObject {

        originX: number;
        originY: number;
        setOrigin(x: number, y: number);
    }

    export class OriginComponent extends Component<IOriginLikeObject> {

        static originX: IProperty<IOriginLikeObject> = {
            name: "originX",
            label: "X",
            defValue: 0.5,
            getValue: obj => obj.originX,
            setValue: (obj, value) => obj.setOrigin(value, obj.originY)
        };

        static originY: IProperty<IOriginLikeObject> = {
            name: "originY",
            label: "Y",
            defValue: 0.5,
            getValue: obj => obj.originY,
            setValue: (obj, value) => obj.setOrigin(obj.originX, value)
        };

        static origin: IPropertyXY = {
            label: "Origin",
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

            let defaultValue = 0.5;

            if (obj instanceof Text) {

                defaultValue = 0;
            }

            if (args.prefabSerializer) {

                add = obj.originX !== args.prefabSerializer.read("originX", defaultValue)
                    || obj.originY !== args.prefabSerializer.read("originY", defaultValue);

            } else {

                add = obj.originX !== defaultValue || obj.originY !== defaultValue;
            }

            if (add) {

                const dom = new code.MethodCallCodeDOM("setOrigin", args.objectVarName);

                dom.argFloat(obj.originX);
                dom.argFloat(obj.originY);

                args.result.push(dom);
            }
        }
    }
}