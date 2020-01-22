namespace phasereditor2d.scene.ui.sceneobjects {

    export class TileSpriteEditorSupport extends BaseImageEditorSupport<TileSprite> {

        constructor(obj: TileSprite) {
            super(TileSpriteExtension.getInstance(), obj);

            this.addComponent(new TileSpriteComponent(obj));
        }

        setInteractive() {

            this.getObject().setInteractive(interactive_getAlpha_RenderTexture);
        }
    }
}