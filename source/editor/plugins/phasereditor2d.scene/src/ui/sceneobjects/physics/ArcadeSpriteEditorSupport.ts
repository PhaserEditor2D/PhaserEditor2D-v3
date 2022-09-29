namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeSpriteEditorSupport extends BaseImageEditorSupport<ArcadeObject> {

        constructor(obj: ArcadeSprite, scene: Scene) {
            super(ArcadeSpriteExtension.getInstance(), obj, scene, true);

            this.addComponent(
                new ArcadeComponent(obj),
            );
        }
    }
}