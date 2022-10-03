namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeImageEditorSupport extends BaseImageEditorSupport<ISceneGameObject> {

        constructor(obj: ArcadeImage, scene: Scene) {
            super(ArcadeImageExtension.getInstance(), obj, scene, true);

            this.addComponent(
                new ArcadeComponent(obj, true),
            );
        }
    }
}