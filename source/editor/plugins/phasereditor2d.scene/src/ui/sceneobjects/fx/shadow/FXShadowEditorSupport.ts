namespace phasereditor2d.scene.ui.sceneobjects {

    export class FXShadowEditorSupport extends FXObjectEditorSupport<FXShadow> {

        constructor(obj: FXShadow, scene: Scene) {
            super(FXShadowExtension.getInstance(), obj, scene);

            this.addComponent(new FXShadowComponent(obj));
        }
    }
}