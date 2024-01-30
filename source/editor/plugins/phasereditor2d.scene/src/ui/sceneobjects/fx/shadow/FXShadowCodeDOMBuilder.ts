namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class FXShadowCodeDOMBuilder extends FXObjectCodeDOMBuilder<Phaser.FX.Shadow> {

        constructor() {
            super("Shadow");
        }

        buildAddFXMethodArgs(call: code.MethodCallCodeDOM, fx: Phaser.FX.Shadow): void {

            call.argFloat(fx.x);
            call.argFloat(fx.y);
            call.argFloat(fx.decay);
            call.argFloat(fx.power);
            call.argFloat(fx.color);
            call.argFloat(fx.samples);
            call.argFloat(fx.intensity);
        }
    }
}