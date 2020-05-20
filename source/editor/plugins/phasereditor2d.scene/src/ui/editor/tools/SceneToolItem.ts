namespace phasereditor2d.scene.ui.editor.tools {

    export abstract class SceneToolItem {

        abstract render(args: ISceneToolRenderArgs);

        abstract containsPoint(args: ISceneToolDragEventArgs): boolean;

        abstract onStartDrag(args: ISceneToolDragEventArgs): void;

        abstract onDrag(args: ISceneToolDragEventArgs): void;

        abstract onStopDrag(args: ISceneToolDragEventArgs): void;

        isValidFor(objects: sceneobjects.ISceneObject[]): boolean {
            return true;
        }

        protected getScreenPointOfObject(args: ISceneToolContextArgs, obj: any, fx: number, fy: number) {

            const worldPoint = new Phaser.Geom.Point(0, 0);

            const sprite = obj as unknown as Phaser.GameObjects.Sprite;

            let width;
            let height;

            if (sprite instanceof sceneobjects.Container) {

                const b = sprite.getBounds();

                width = b.width;
                height = b.height;

            } else {

                width = sprite.width;
                height = sprite.height;
            }

            const x = width * fx;
            const y = height * fy;

            sprite.getWorldTransformMatrix().transformPoint(x, y, worldPoint);

            return args.camera.getScreenPoint(worldPoint.x, worldPoint.y);

        }

        protected getScreenToObjectScale(args: ISceneToolContextArgs, obj: any) {

            let x = args.camera.zoom;
            let y = args.camera.zoom;

            const sprite = obj as Phaser.GameObjects.Sprite;

            let next = sprite.parentContainer;

            while (next) {

                x *= next.scaleX;
                y *= next.scaleY;
                next = next.parentContainer;
            }

            return { x, y };
        }

        protected globalAngle(sprite: Phaser.GameObjects.Sprite) {

            let a = sprite.angle;

            const parent = sprite.parentContainer;

            if (parent) {

                a += this.globalAngle(parent as unknown as Phaser.GameObjects.Sprite);
            }

            return a;
        }

        protected drawArrowPath(ctx: CanvasRenderingContext2D, color: string) {

            ctx.save();

            ctx.fillStyle = color;
            ctx.strokeStyle = "#000";

            ctx.beginPath();
            ctx.moveTo(0, -6);
            ctx.lineTo(12, 0);
            ctx.lineTo(0, 6);
            ctx.closePath();

            ctx.fill();
            ctx.stroke();

            ctx.restore();
        }

        protected drawCircle(ctx: CanvasRenderingContext2D, color: string) {

            ctx.fillStyle = color;

            ctx.beginPath();
            ctx.arc(0, 0, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "#000";
            ctx.stroke();
        }

        protected drawRect(ctx: CanvasRenderingContext2D, color: string) {

            ctx.save();

            ctx.translate(-5, -5);
            ctx.beginPath();
            ctx.rect(0, 0, 10, 10);

            ctx.fillStyle = color;
            ctx.strokeStyle = "#000";

            ctx.fill();
            ctx.stroke();

            ctx.restore();
        }

        protected getAvgScreenPointOfObjects(
            args: ISceneToolContextArgs,
            fx: (ob: Phaser.GameObjects.Sprite) => number = obj => 0,
            fy: (ob: Phaser.GameObjects.Sprite) => number = obj => 0) {

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