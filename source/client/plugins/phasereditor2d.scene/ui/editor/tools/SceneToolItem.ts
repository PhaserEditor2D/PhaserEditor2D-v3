namespace phasereditor2d.scene.ui.editor.tools {

    export abstract class SceneToolItem {

        abstract render(args: ISceneToolRenderArgs);

        protected getScreenPointOfObject(args: ISceneToolRenderArgs, obj: any, fx: number, fy: number) {

            const worldPoint = new Phaser.Geom.Point(0, 0);

            const sprite = obj as unknown as Phaser.GameObjects.Sprite;

            const x = sprite.width * fx;
            const y = sprite.height * fy;

            sprite.getWorldTransformMatrix().transformPoint(x, y, worldPoint);

            return args.camera.getScreenPoint(worldPoint.x, worldPoint.y);

        }

        protected drawArrowPath(ctx: CanvasRenderingContext2D) {

            ctx.save();

            ctx.beginPath();
            ctx.moveTo(0, -6);
            ctx.lineTo(12, 0);
            ctx.lineTo(0, 6);
            ctx.closePath();

            ctx.fill();
            ctx.stroke();

            ctx.restore();
        }

        protected getAvgScreenPointOfObjects(
            args: ISceneToolRenderArgs,
            fx: (ob: Phaser.GameObjects.Sprite) => number,
            fy: (ob: Phaser.GameObjects.Sprite) => number) {

            const worldPoint = new Phaser.Math.Vector2(0, 0);

            let avgY = 0;
            let avgX = 0;

            for (const obj of args.objects) {

                const point = this.getScreenPointOfObject(args, obj, fx(obj as any), fy(obj as any));

                avgX += point.x;
                avgY += point.y;
            }

            avgX /= args.objects.length;
            avgY /= args.objects.length;

            return new Phaser.Math.Vector2(avgX, avgY);
        }
    }
}