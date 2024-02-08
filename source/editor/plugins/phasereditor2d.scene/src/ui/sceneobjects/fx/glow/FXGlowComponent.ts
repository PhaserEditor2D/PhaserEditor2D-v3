/// <reference path="../FXProperty.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class FXGlowComponent extends Component<FXGlow> {

        static color = FXProperty(NumberColorProperty("color", "#ffffff", "Color", "phaser:Phaser.FX.Glow.color"));
        static outerStrength = FXProperty(SimpleProperty("outerStrength", 4, "Outer Strength", "phaser:Phaser.FX.Glow.outerStrength", false, undefined, 1, 0));
        static innerStrength = FXProperty(SimpleProperty("innerStrength", 0, "Inner Strength", "phaser:Phaser.FX.Glow.innerStrength", false, undefined, 1, 0));
        static knockout = FXProperty(SimpleProperty("knockout", false, "Knockout", "phaser:Phaser.FX.Glow.knockout"));

        constructor(obj: FXGlow) {
            super(obj, [
                FXGlowComponent.color,
                FXGlowComponent.outerStrength,
                FXGlowComponent.innerStrength,
                FXGlowComponent.knockout
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            const obj = this.getObject();

            const objES = obj.getEditorSupport();

            if (objES.isNestedPrefabInstance()) {

                NumberColorPropertyCodeDomAdapter
                this.buildSetObjectPropertyCodeDOM_FloatProperty(args,
                    NumberColorPropertyCodeDomAdapter2(FXGlowComponent.color),
                    FXGlowComponent.outerStrength,
                    FXGlowComponent.innerStrength,
                );

                this.buildSetObjectPropertyCodeDOM_BooleanProperty(args,
                    FXGlowComponent.knockout
                );
            }
        }
    }
}