namespace phasereditor2d.scene.ui.sceneobjects {

    export function interactive_getAlpha_SharedTexture(hitArea, x: number, y: number, obj: ITransformLikeObject) {

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

    export function interactive_getAlpha_RenderTexture(hitArea, x: number, y: number, obj: ITransformLikeObject) {

        const sprite = obj as unknown as Phaser.GameObjects.Sprite;

        // TODO: lets fix the bound checking.
        // const hitBounds = x >= 0 && y >= 0 && x <= sprite.width && y <= sprite.height;
        // if (!hitBounds) {
        //     return false;
        // }

        const scene = obj.getEditorSupport().getScene();

        const renderTexture = new Phaser.GameObjects.RenderTexture(scene, 0, 0, 500, 500);

        const scaleX = sprite.scaleX;
        const scaleY = sprite.scaleY;
        const originX = sprite.originX;
        const originY = sprite.originY;
        const angle = sprite.angle;

        sprite.scaleX = 1;
        sprite.scaleY = 1;
        sprite.originX = 0;
        sprite.originY = 0;
        sprite.angle = 0;

        let renderX = -x;
        let renderY = -y;

        if (sprite instanceof TileSprite) {

            renderX = -x - sprite.width * originX;
            renderY = -y - sprite.height * originY;
        }

        renderTexture.draw([sprite], renderX, renderY);

        sprite.scaleX = scaleX;
        sprite.scaleY = scaleY;
        sprite.originX = originX;
        sprite.originY = originY;
        sprite.angle = angle;

        const colorArray: Phaser.Display.Color[] = [];

        renderTexture.snapshotPixel(0, 0, (c: Phaser.Display.Color) => {
            colorArray[0] = c;
        });

        renderTexture.destroy();

        const color = colorArray[0];
        const alpha = color ? color.alpha : 0;

        return alpha > 0;
    }
}