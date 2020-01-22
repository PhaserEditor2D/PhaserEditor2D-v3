namespace phasereditor2d.scene.ui.sceneobjects {

    export class ImageEditorSupport extends BaseImageEditorSupport<Image> {

        constructor(obj: Image) {
            super(ImageExtension.getInstance(), obj);
        }

        setInteractive() {
            this.getObject().setInteractive(interactive_getAlpha_SharedTexture);
        }
    }
}