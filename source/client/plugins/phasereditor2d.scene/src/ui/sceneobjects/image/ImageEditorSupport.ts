namespace phasereditor2d.scene.ui.sceneobjects {

    export class ImageEditorSupport extends BaseImageEditorSupport<Image> {

        constructor(obj: Image, scene: Scene) {
            super(ImageExtension.getInstance(), obj, scene);
        }
    }
}