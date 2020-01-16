/// <reference path="../Component.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;

    export interface IOriginLike extends ISceneObject {

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

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            const obj = this.getObject();

            this.buildSetObjectPropertyCodeDOM_Float("originX", obj.originX, 0.5, args);
            this.buildSetObjectPropertyCodeDOM_Float("originY", obj.originY, 0.5, args);
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