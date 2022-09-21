namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeImageEditorSupport extends BaseImageEditorSupport<ArcadeObject> {

        constructor(obj: ArcadeObject, scene: Scene) {
            super(ArcadeImageExtension.getInstance(), obj, scene, true);

            this.addComponent(
                new ArcadeComponent(obj),
            );
        }
    }
}