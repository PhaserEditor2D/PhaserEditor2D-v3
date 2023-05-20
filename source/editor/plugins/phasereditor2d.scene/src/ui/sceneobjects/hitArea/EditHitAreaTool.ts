/// <reference path="../object/tools/BaseObjectTool.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class EditHitAreaTool extends BaseObjectTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.EditHitAreaTool";
        static TOOL_COLOR = "orange";
        private _polygonToolItem: PolygonHitAreaToolItem;

        constructor() {
            super({
                id: EditHitAreaTool.ID,
                command: editor.commands.CMD_EDIT_HIT_AREA,
            },
                RectangleHitAreaComponent.x,
                RectangleHitAreaComponent.y,
                RectangleHitAreaComponent.width,
                RectangleHitAreaComponent.height,
                EllipseHitAreaComponent.x,
                EllipseHitAreaComponent.y,
                EllipseHitAreaComponent.width,
                EllipseHitAreaComponent.height,
                CircleHitAreaComponent.x,
                CircleHitAreaComponent.y,
                CircleHitAreaComponent.radius
            );

            this.addItems(
                new RectangleHitAreaSizeToolItem(1, 0.5),
                new RectangleHitAreaSizeToolItem(1, 1),
                new RectangleHitAreaSizeToolItem(0.5, 1),
                new RectangleHitAreaOffsetToolItem(0, 0),
                new RectangleHitAreaOffsetToolItem(0.5, 0),
                new RectangleHitAreaOffsetToolItem(0, 0.5),

                new EllipseHitAreaSizeToolItem(1, 0.5),
                new EllipseHitAreaSizeToolItem(1, 1),
                new EllipseHitAreaSizeToolItem(0.5, 1),
                new EllipseHitAreaOffsetToolItem(0, 0),
                new EllipseHitAreaOffsetToolItem(0.5, 0),
                new EllipseHitAreaOffsetToolItem(0, 0.5),

                new CircleHitAreaSizeToolItem(),
                new CircleHitAreaOffsetToolItem(),

                this._polygonToolItem = new PolygonHitAreaToolItem()
            );
        }

        handleDoubleClick(args: editor.tools.ISceneToolContextArgs): boolean {

            if (this._polygonToolItem.isValidFor(args.objects)) {

                return this._polygonToolItem.handleDoubleClick(args);
            }

            return super.handleDoubleClick(args);
        }

        handleDeleteCommand(args: editor.tools.ISceneToolContextArgs): boolean {

            if (this._polygonToolItem.isValidFor(args.objects)) {
                
                return this._polygonToolItem.handleDeleteCommand(args);
            }

            return super.handleDeleteCommand(args);
        }

        requiresRepaintOnMouseMove() {

            return true;
        }

        protected getProperties(obj?: any): IProperty<any>[] {

            if (HitAreaComponent.hasHitArea(obj)) {

                return [
                    RectangleHitAreaComponent.x,
                    RectangleHitAreaComponent.x,
                    RectangleHitAreaComponent.width,
                    RectangleHitAreaComponent.height
                ];
            }

            return [];
        }

        async onActivated(args: editor.tools.ISceneToolContextArgs) {

            super.onActivated(args);

            for (const obj of args.objects) {

                if (!HitAreaComponent.hasHitArea(obj)) {

                    return;
                }
            }

            const sections = [RectangleHitAreaSection.ID];

            const props: Set<IProperty<ISceneGameObject>> = new Set();

            for (const obj of args.objects) {

                const objProps = this.getProperties(obj);

                for (const prop of objProps) {

                    props.add(prop);
                }
            }

            await this.confirmUnlockProperty(args, [...props], "hit area", ...sections);
        }

        render(args: editor.tools.ISceneToolRenderArgs): void {

            for (const obj of args.objects) {

                if (EditHitAreaTool.isValidFor(obj)) {

                    this.renderObj(args, obj as Sprite);
                }
            }

            super.render(args);
        }

        static isValidFor(...objects: ISceneGameObject[]): boolean {

            for (const obj of objects) {

                if (!HitAreaComponent.hasHitArea(obj)
                    || HitAreaComponent.getShape(obj) === HitAreaShape.NONE) {

                    return false
                }
            }

            return true;
        }

        private renderObj(args: editor.tools.ISceneToolRenderArgs, obj: Sprite) {

            const objES = obj.getEditorSupport();

            const comp = objES.getComponent(HitAreaComponent) as HitAreaComponent;

            const shape = comp.getHitAreaShape();

            if (shape === HitAreaShape.PIXEL_PERFECT) {

                // pixel perfect doesn't have any tool item

                return;
            }

            const ctx = args.canvasContext;

            ctx.save();

            if (shape === HitAreaShape.ELLIPSE) {

                this.renderEllipse(obj, args, ctx);

            } else if (shape === HitAreaShape.CIRCLE) {

                this.renderCircle(obj, args, ctx);

            } else if (shape === HitAreaShape.POLYGON) {

                this.renderPolygon(obj, args, ctx);

            } else {

                this.renderRect(obj, args, ctx);
            }

            ctx.restore();
        }

        private renderPolygon(obj: Sprite, args: editor.tools.ISceneToolRenderArgs, ctx: CanvasRenderingContext2D) {

            const origin = obj.getEditorSupport().computeDisplayOrigin();

            if (obj instanceof Container) {

                origin.displayOriginX = 0;
                origin.displayOriginY = 0;
            }

            const comp = PolygonHitAreaComponent.getPolygonComponent(obj);

            const tx = obj.getWorldTransformMatrix();

            const points: Array<Phaser.Math.Vector2> = comp.vectors
                .map(p => new Phaser.Math.Vector2(
                    p.x - origin.displayOriginX,
                    p.y - origin.displayOriginY))

                .map(p => tx.transformPoint(p.x, p.y))

                .map(p => args.camera.getScreenPoint(p.x, p.y));

            // close the path
            points.push(points[0]);

            ctx.save();

            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            this.drawPath(ctx, points);

            ctx.strokeStyle = EditHitAreaTool.TOOL_COLOR;
            ctx.lineWidth = 1;
            this.drawPath(ctx, points);

            ctx.restore();
        }

        private renderRect(obj: Sprite, args: editor.tools.ISceneToolRenderArgs, ctx: CanvasRenderingContext2D) {

            const origin = obj.getEditorSupport().computeDisplayOrigin();

            if (obj instanceof Container) {

                origin.displayOriginX = 0;
                origin.displayOriginY = 0;
            }

            const comp = RectangleHitAreaComponent.getRectangleComponent(obj);

            const { x, y, width, height } = comp;

            let x1 = x - origin.displayOriginX;
            let y1 = y - origin.displayOriginY;
            let x2 = x1 + width;
            let y2 = y1 + height;

            const tx = obj.getWorldTransformMatrix();

            const points = [
                [x1, y1],
                [x2, y1],
                [x2, y2],
                [x1, y2],
                [x1, y1]
            ].map(([x, y]) => {

                return tx.transformPoint(x, y);
            }).map(p => {

                return args.camera.getScreenPoint(p.x, p.y);
            });

            ctx.save();

            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            this.drawPath(ctx, points);

            ctx.strokeStyle = EditHitAreaTool.TOOL_COLOR;
            ctx.lineWidth = 1;
            this.drawPath(ctx, points);

            ctx.restore();
        }

        private drawPath(ctx: CanvasRenderingContext2D, points: Phaser.Math.Vector2[]) {

            ctx.beginPath();

            ctx.moveTo(points[0].x, points[0].y);

            for (const p of points) {

                ctx.lineTo(p.x, p.y);
            }

            ctx.stroke();
            ctx.closePath();
        }

        private renderEllipse(obj: Sprite, args: editor.tools.ISceneToolRenderArgs, ctx: CanvasRenderingContext2D) {

            const comp = EllipseHitAreaComponent.getEllipseComponent(obj);

            const { x, y, width, height } = comp;

            this.renderEllipseHelper(args, ctx, obj, x, y, width, height, true);
        }

        private drawEllipse(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, angle: number) {

            const rx = w / 2;
            const ry = h / 2;

            ctx.ellipse(x, y, rx, ry, Phaser.Math.DegToRad(angle), 0, Math.PI * 2);
        }

        private renderCircle(obj: Sprite, args: editor.tools.ISceneToolRenderArgs, ctx: CanvasRenderingContext2D) {

            const comp = CircleHitAreaComponent.getCircleComponent(obj);

            const { x, y, radius } = comp;

            const width = radius * 2;
            const height = width;

            this.renderEllipseHelper(args, ctx, obj, x, y, width, height, false);
        }

        private renderEllipseHelper(args: editor.tools.ISceneToolRenderArgs, ctx: CanvasRenderingContext2D, obj: Sprite, x: number, y: number, width: number, height: number, dashedRect: boolean) {

            const origin = obj.getEditorSupport().computeDisplayOrigin();

            if (obj instanceof Container) {

                origin.displayOriginX = 0;
                origin.displayOriginY = 0;
            }

            let x1 = x - origin.displayOriginX;
            let y1 = y - origin.displayOriginY;
            let x2 = x1 + width;
            let y2 = y1 + height;
            const tx = obj.getWorldTransformMatrix();

            let points = [
                [x1, y1],
                [x2, y1],
                [x2, y2],
            ]
                .map(([x, y]) => tx.transformPoint(x, y))

                .map(p => args.camera.getScreenPoint(p.x, p.y));

            const [p1, p2, p3] = points;

            const screenWidth = Phaser.Math.Distance.BetweenPoints(p1, p2);
            const screenHeight = Phaser.Math.Distance.BetweenPoints(p2, p3);
            const angle = ui.editor.tools.SceneToolItem.getGlobalAngle(obj);

            ctx.save();

            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            this.drawEllipse(ctx, p1.x, p1.y, screenWidth, screenHeight, angle);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.strokeStyle = EditHitAreaTool.TOOL_COLOR;
            ctx.lineWidth = 1;
            this.drawEllipse(ctx, p1.x, p1.y, screenWidth, screenHeight, angle);
            ctx.stroke();
            ctx.closePath();

            if (dashedRect) {

                // dashed rect

                x1 = x - origin.displayOriginX - width / 2;
                y1 = y - origin.displayOriginY - height / 2;
                x2 = x1 + width;
                y2 = y1 + height;

                points = [
                    [x1, y1],
                    [x2, y1],
                    [x2, y2],
                    [x1, y2],
                    [x1, y1]
                ]
                    .map(([x, y]) => tx.transformPoint(x, y))

                    .map(p => args.camera.getScreenPoint(p.x, p.y));

                ctx.setLineDash([1, 1]);
                this.drawPath(ctx, points);

                ctx.restore();
            }
        }
    }
}