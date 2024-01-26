/// <reference path="./FXProperty.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class FXGlowComponent extends Component<FXGlow> {

        static color = FXProperty(NumberColorProperty("color", "#ffffff", "Color", "phaser:Phaser.FX.Glow.color"));
        static outerStrength = FXProperty(SimpleProperty("outerStrength", 4, "Outer Strength", "phaser:Phaser.FX.Glow.outerStrength"));
        static innerStrength = FXProperty(SimpleProperty("innerStrength", 0, "Inner Strength", "phaser:Phaser.FX.Glow.innerStrength"));
        static knockout = FXProperty(SimpleProperty("knockout", false, "Knockout", "phaser:Phaser.FX.Glow.knockout"));

        constructor(obj: FXGlow) {
            super(obj, [
                FXGlowComponent.color
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {
            throw new Error("Method not implemented.");
        }
    }
}