/// <reference path="../Component.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;
    import code = core.code;

    export interface IOriginLike extends ISceneObject {

        originX: number;
        originY: number;
        setOrigin(x: number, y: number);
    }

    export class OriginComponent extends Component<IOriginLike> {

        static originX: IProperty<IOriginLike> = {
            name: "originX",
            label: "X",
            defValue: 0.5,
            getValue: obj => obj.originX,
            setValue: (obj, value) => obj.setOrigin(value, obj.originY)
        };

        static originY: IProperty<IOriginLike> = {
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

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            const obj = this.getObject();

            let add = false;

            if (args.prefabSerializer) {

                add = obj.originX !== args.prefabSerializer.read("originX", 0.5)
                    || obj.originY !== args.prefabSerializer.read("originY", 0.5);

            } else {

                add = obj.originX !== 0.5 || obj.originY !== 0.5;
            }

            if (add) {

                const dom = new code.MethodCallCodeDOM("setOrigin", args.objectVarName);

                dom.argFloat(obj.originX);
                dom.argFloat(obj.originY);

                args.result.push(dom);
            }
        }

        readJSON(ser: json.Serializer) {

            this.read(ser,
                OriginComponent.originX,
                OriginComponent.originY
            );
        }

        writeJSON(ser: json.Serializer) {

            this.write(ser,
                OriginComponent.originX,
                OriginComponent.originY
            );
        }
    }
}