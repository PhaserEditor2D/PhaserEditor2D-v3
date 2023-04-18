namespace phasereditor2d.scene.ui.editor.tools {

    export abstract class SceneToolItem {

        abstract render(args: ISceneToolRenderArgs);

        abstract containsPoint(args: ISceneToolDragEventArgs): boolean;

        abstract onStartDrag(args: ISceneToolDragEventArgs): void;

        abstract onDrag(args: ISceneToolDragEventArgs): void;

        abstract onStopDrag(args: ISceneToolDragEventArgs): void;

        isValidFor(objects: sceneobjects.ISceneGameObject[]): boolean {
            return true;
        }

        getTranslationInAxisWorldDelta(
            axis: "x" | "y" | "xy",
            initCursorX: number,
            initCursorY: number,
            args: ISceneToolDragEventArgs) {

            const dx = args.x - initCursorX;
            const dy = args.y - initCursorY;

            let worldDx = dx / args.camera.zoom;
            let worldDy = dy / args.camera.zoom;

            const rot = Phaser.Math.DegToRad(this.getAvgGlobalAngle(args));

            const worldDelta = new Phaser.Math.Vector2();

            const xAxis = axis === "x" || axis === "xy" ? 1 : 0;
            const yAxis = axis === "y" || axis === "xy" ? 1 : 0;

            if (args.localCoords && axis !== "xy") {

                const axisVector = new Phaser.Math.Vector2(xAxis, yAxis);

                axisVector.rotate(rot);

                let worldDeltaVector = new Phaser.Math.Vector2(worldDx, worldDy);

                const projectionLength = worldDeltaVector.dot(axisVector);

                worldDeltaVector = axisVector.clone().scale(projectionLength);

                worldDx = worldDeltaVector.x;
                worldDy = worldDeltaVector.y;

                worldDelta.add(worldDeltaVector);

                return worldDeltaVector;
            }

            return new Phaser.Math.Vector2(worldDx * xAxis, worldDy * yAxis);
        }

        getSimpleTranslationPoint(axis: "x" | "y" | "xy", args: editor.tools.ISceneToolContextArgs) {

            const { x, y } = this.getAvgScreenPointOfObjects(args);

            const xAxis = axis === "x" || axis === "xy" ? 1 : 0;
            const yAxis = axis === "y" || axis === "xy" ? 1 : 0;

            const axisVector = new Phaser.Math.Vector2(xAxis, yAxis);

            if (args.localCoords) {

                const angle = this.getAvgGlobalAngle(args);

                axisVector.rotate(Phaser.Math.DegToRad(angle));
            }

            axisVector.scale(100);

            if (axis === "xy") {
                return { x, y };
            }

            return {
                x: x + axisVector.x,
                y: y + axisVector.y
            };
        }

        renderSimpleAxis(
            axis: "x" | "y" | "xy", centerX: number, centerY: number, dotColor: string,
            args: editor.tools.ISceneToolRenderArgs) {

            const ctx = args.canvasContext;

            ctx.strokeStyle = "#000";

            if (axis === "xy") {

                ctx.save();

                ctx.translate(centerX, centerY);

                this.drawCircle(ctx,
                    args.canEdit ? dotColor : editor.tools.SceneTool.COLOR_CANNOT_EDIT);

                ctx.restore();

            } else {

                ctx.save();

                ctx.translate(centerX, centerY);

                if (args.localCoords) {

                    const angle = this.getAvgGlobalAngle(args);

                    ctx.rotate(Phaser.Math.DegToRad(angle));
                }

                if (axis === "y") {

                    ctx.rotate(Math.PI / 2);
                }

                this.drawArrowPath(ctx,
                    args.canEdit ? (axis === "x" ? "#f00" : "#0f0") : editor.tools.SceneTool.COLOR_CANNOT_EDIT);

                ctx.restore();
            }
        }

        protected getScreenPointOfObject(args: ISceneToolContextArgs, obj: any, fx: number, fy: number, removeRotation = false) {

            const worldPoint = new Phaser.Geom.Point(0, 0);

            const sprite = obj as unknown as sceneobjects.Sprite;

            const { width, height } = this.computeSize(sprite);

            const x = width * fx;
            const y = height * fy;

            const tx = sprite.getWorldTransformMatrix();

            if (removeRotation) {

                tx.rotate(-tx.rotation);
            }

            tx.transformPoint(x, y, worldPoint);

            return args.camera.getScreenPoint(worldPoint.x, worldPoint.y);
        }

        protected computeSize(obj: ui.sceneobjects.ISceneGameObject) {

            const size = obj.getEditorSupport().computeSize();

            return size;
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

        protected globalAngle(sprite: Phaser.GameObjects.GameObject & { angle: number }) {

            return SceneToolItem.getGlobalAngle(sprite);
        }

        static getGlobalAngle(sprite: Phaser.GameObjects.GameObject & { angle: number }) {

            let a = sprite.angle;

            const parent = sprite.parentContainer;

            if (parent) {

                a += this.getGlobalAngle(parent);
            }

            return a;
        }

        protected drawLinePath(ctx: CanvasRenderingContext2D, color: string, x1: number, y1: number, x2: number, y2: number, dashed = false) {

            ctx.save();

            if (dashed) {

                ctx.setLineDash([5, 10]);
                ctx.lineCap = "square";
            }

            ctx.strokeStyle = "#000";
            ctx.lineWidth = 1.5;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.closePath();
            ctx.stroke();

            ctx.strokeStyle = color;
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.closePath();
            ctx.stroke();

            ctx.restore();
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

        protected drawRect(ctx: CanvasRenderingContext2D, color: string, borderColor = "#000") {

            ctx.save();

            ctx.translate(-5, -5);
            ctx.beginPath();
            ctx.rect(0, 0, 10, 10);

            ctx.fillStyle = color;
            ctx.strokeStyle = borderColor;

            ctx.fill();
            ctx.stroke();

            ctx.restore();
        }

        protected getAvgGlobalAngle(args: ISceneToolContextArgs) {

            let total = 0;
            let count = 0;

            for (const obj of args.objects) {

                total += this.globalAngle(obj as any);
                count++;
            }

            return total / count;
        }

        protected getAvgScreenPointOfObjects(
            args: ISceneToolContextArgs,
            fx: (ob: sceneobjects.Image | any) => number = obj => 0,
            fy: (ob: sceneobjects.Image | any) => number = obj => 0,
            removeRotation = false) {

            let avgY = 0;
            let avgX = 0;

            for (const obj of args.objects) {

                const point = this.getScreenPointOfObject(args, obj, fx(obj as any), fy(obj as any), removeRotation);

                avgX += point.x;
                avgY += point.y;
            }

            avgX /= args.objects.length;
            avgY /= args.objects.length;

            return new Phaser.Math.Vector2(avgX, avgY);
        }
    }
}