namespace phasereditor2d.scene.ui.sceneobjects {

    export class ImageEditorSupport extends EditorSupport<Image> {

        private _textureComponent: TextureComponent;
        private _transformComponent: TransformComponent;

        constructor(obj: Image) {
            super(ImageExtension.getInstance(), obj);

            this._textureComponent = new TextureComponent(obj);
            this._transformComponent = new TransformComponent(obj);

            this.addComponent(
                this._transformComponent,
                this._textureComponent
            );
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {
            return new ImageObjectCellRenderer();
        }

        getTextureSupport() {
            return this._textureComponent;
        }

        getTransformSupport() {
            return this._transformComponent;
        }

        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera) {

            const sprite = this.getObject();

            const points: Phaser.Math.Vector2[] = [
                new Phaser.Math.Vector2(0, 0),
                new Phaser.Math.Vector2(0, 0),
                new Phaser.Math.Vector2(0, 0),
                new Phaser.Math.Vector2(0, 0)
            ];

            let w = sprite.width;
            let h = sprite.height;

            if (sprite instanceof Phaser.GameObjects.BitmapText) {
                // the BitmapText.width is considered a displayWidth, it is already multiplied by the scale
                w = w / sprite.scaleX;
                h = h / sprite.scaleY;
            }

            let flipX = sprite.flipX ? -1 : 1;
            let flipY = sprite.flipY ? -1 : 1;

            if (sprite instanceof Phaser.GameObjects.TileSprite) {
                flipX = 1;
                flipY = 1;
            }

            const ox = sprite.originX;
            const oy = sprite.originY;

            const x = -w * ox * flipX;
            const y = -h * oy * flipY;

            const tx = sprite.getWorldTransformMatrix();

            tx.transformPoint(x, y, points[0]);
            tx.transformPoint(x + w * flipX, y, points[1]);
            tx.transformPoint(x + w * flipX, y + h * flipY, points[2]);
            tx.transformPoint(x, y + h * flipY, points[3]);

            return points.map(p => camera.getScreenPoint(p.x, p.y));
        }
    }
}