/// <reference path="../FXObjectEditorSupport.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

        export class FXGlowEditorSupport extends FXObjectEditorSupport<FXGlow> {

            constructor(obj: FXGlow, scene: Scene) {
                super(FXGlowExtension.getInstance(), obj, scene);

                this.addComponent(new FXGlowComponent(obj));
            }
        }
}