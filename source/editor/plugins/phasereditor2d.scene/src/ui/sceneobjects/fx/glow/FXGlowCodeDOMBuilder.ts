namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class FXGlowCodeDOMBuilder extends FXObjectCodeDOMBuilder<Phaser.FX.Glow> {

        constructor() {
            super("Glow");
        }

        buildAddFXMethodArgs(call: code.MethodCallCodeDOM, fx: Phaser.FX.Glow): void {

            call.argFloat(fx.color);
            call.argFloat(fx.outerStrength);
            call.argFloat(fx.innerStrength);
            call.argBool(fx.knockout as any);
        }
    }
}