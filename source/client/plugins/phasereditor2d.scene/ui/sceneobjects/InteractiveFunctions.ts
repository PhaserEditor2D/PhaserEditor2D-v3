namespace phasereditor2d.scene.ui.sceneobjects {

    export function getAlpha_SharedTexture(hitArea, x: number, y: number, obj: ITransformLikeObject) {

        const sprite = obj as unknown as Phaser.GameObjects.Sprite;

        if (sprite.flipX) {
            x = 2 * sprite.displayOriginX - x;
        }

        if (sprite.flipY) {
            y = 2 * sprite.displayOriginY - y;
        }

        const textureManager = obj.getEditorSupport().getScene().textures;

        const alpha = textureManager.getPixelAlpha(x, y, sprite.texture.key, sprite.frame.name);

        return alpha;
    }
}