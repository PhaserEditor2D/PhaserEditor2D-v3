/// <reference path="../FXProperty.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class FXShadowComponent extends Component<FXShadow> {

        static x = FXProperty(SimpleProperty("x", 0, "X", "phaser:Phaser.FX.Shadow.x"));
        static y = FXProperty(SimpleProperty("y", 0, "Y", "phaser:Phaser.FX.Shadow.y"));
        static decay = FXProperty(SimpleProperty("decay", 0.1, "Decay", "phaser:Phaser.FX.Shadow.decay"));
        static power = FXProperty(SimpleProperty("power", 1, "Power", "phaser:Phaser.FX.Shadow.power"));
        static color = FXProperty(NumberColorProperty("color", "#000000", "Color", "phaser:Phaser.FX.Shadow.color"));
        static samples = FXProperty(SimpleProperty("samples", 6, "Samples", "phaser:Phaser.FX.Shadow.samples"));
        static intensity = FXProperty(SimpleProperty("intensity", 1, "Intensity", "phaser:Phaser.FX.Shadow.intensity"));

        constructor(obj: FXShadow) {
            super(obj, [
                FXShadowComponent.x,
                FXShadowComponent.y,
                FXShadowComponent.decay,
                FXShadowComponent.power,
                FXShadowComponent.color,
                FXShadowComponent.samples,
                FXShadowComponent.intensity
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            const obj = this.getObject();

            const objES = obj.getEditorSupport();

            if (objES.isNestedPrefabInstance()) {

                this.buildSetObjectPropertyCodeDOM_FloatProperty(args,
                    FXShadowComponent.x,
                    FXShadowComponent.y,
                    FXShadowComponent.decay,
                    FXShadowComponent.power,
                    NumberColorPropertyCodeDomAdapter2(FXShadowComponent.color),
                    FXShadowComponent.samples,
                    FXShadowComponent.intensity,
                );
            }
        }
    }
}