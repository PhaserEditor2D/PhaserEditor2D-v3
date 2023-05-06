/// <reference path="../object/tools/BaseObjectTool.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class ResizeHitAreaTool extends BaseObjectTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.ResizeHitAreaTool";
        static TOOL_COLOR = "orange";

        constructor() {
            super({
                id: ResizeHitAreaTool.ID,
                command: editor.commands.CMD_RESIZE_HIT_AREA,
            },
                RectangleHitAreaComponent.x,
                RectangleHitAreaComponent.y,
                RectangleHitAreaComponent.width,
                RectangleHitAreaComponent.height
            );

            this.addItems(
                new ResizeHitAreaToolItem(1, 0.5),
                new ResizeHitAreaToolItem(1, 1),
                new ResizeHitAreaToolItem(0.5, 1),
                new RectangleHitAreaOffsetToolItem(0, 0),
                new RectangleHitAreaOffsetToolItem(0.5, 0),
                new RectangleHitAreaOffsetToolItem(0, 0.5),
                // new ArcadeBodyCircleOffsetToolItem(),
                // new ArcadeBodyRadiusToolItem()
            );
        }

        protected getProperties(obj?: any): IProperty<any>[] {

            if (GameObjectEditorSupport.hasObjectComponent(obj, RectangleHitAreaComponent)) {

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

                const objES = obj.getEditorSupport();

                if (!objES.hasComponent(HitAreaComponent)) {

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

                this.renderObj(args, obj as Sprite);
            }

            super.render(args);
        }

        private renderObj(args: editor.tools.ISceneToolRenderArgs, obj: Sprite) {

            const ctx = args.canvasContext;

            ctx.save();

            const objES = obj.getEditorSupport();

            const comp = objES.getComponent(HitAreaComponent) as HitAreaComponent;

            const shape = comp.getHitAreaShape();

            if (shape === HitAreaShape.CIRCLE) {

                this.renderCircle(obj, args, ctx);

            } else {

                this.renderRect(obj, args, ctx);
            }

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

            ctx.strokeStyle = ResizeHitAreaTool.TOOL_COLOR;
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

        private renderCircle(obj: Sprite, args: editor.tools.ISceneToolRenderArgs, ctx: CanvasRenderingContext2D) {

            // const body = ArcadeComponent.getBody(obj);

            // const p = new Phaser.Math.Vector2();

            // const origin = obj.getEditorSupport().computeDisplayOrigin();

            // if (obj instanceof Container) {

            //     origin.displayOriginX = 0;
            //     origin.displayOriginY = 0;
            // }

            // const bodyRadius = ArcadeComponent.radius.getValue(obj);
            // let x1 = body.offset.x - origin.displayOriginX;
            // let y1 = body.offset.y - origin.displayOriginY;
            // let x2 = x1 + bodyRadius * 2;
            // let y2 = y1 + bodyRadius * 2;

            // const tx = obj.getWorldTransformMatrix();
            // // removes rotation
            // tx.rotate(-tx.rotation);
            // tx.transformPoint(x1, y1, p);
            // x1 = p.x;
            // y1 = p.y;

            // tx.transformPoint(x2, y2, p);
            // x2 = p.x;
            // y2 = p.y;

            // const p1 = args.camera.getScreenPoint(x1, y1);
            // const p2 = args.camera.getScreenPoint(x2, y2);

            // const r = (p2.x - p1.x) / 2;
            // const x = p1.x + r;
            // const y = p1.y + r;

            // ctx.strokeStyle = "black";
            // ctx.lineWidth = 3;
            // ctx.beginPath();
            // ctx.ellipse(x, y, r, r, 0, 0, 360);
            // ctx.stroke();

            // ctx.strokeStyle = ArcadeBodyTool.BODY_TOOL_COLOR;
            // ctx.lineWidth = 1;
            // ctx.beginPath();
            // ctx.ellipse(x, y, r, r, 0, 0, 360);
            // ctx.stroke();
        }
    }
}