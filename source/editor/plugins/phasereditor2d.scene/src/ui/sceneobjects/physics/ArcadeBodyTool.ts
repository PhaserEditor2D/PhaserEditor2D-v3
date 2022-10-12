namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeBodyTool extends BaseObjectTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.ArcadeBodyTool";
        static BODY_TOOL_COLOR = "pink";

        constructor() {
            super({
                id: ArcadeBodyTool.ID,
                command: editor.commands.CMD_EDIT_ARCADE_BODY,
            },
                ArcadeComponent.offset.x,
                ArcadeComponent.offset.y,
                ArcadeComponent.radius,
                ArcadeComponent.size.x,
                ArcadeComponent.size.y);

            this.addItems(
                new ArcadeBodySizeToolItem(1, 0.5),
                new ArcadeBodySizeToolItem(1, 1),
                new ArcadeBodySizeToolItem(0.5, 1),
                new ArcadeBodyOffsetToolItem(0, 0),
                new ArcadeBodyOffsetToolItem(0.5, 0),
                new ArcadeBodyOffsetToolItem(0, 0.5),
                new ArcadeBodyCircleOffsetToolItem(),
                new ArcadeBodyRadiusToolItem()
            );
        }

        protected getProperties(obj?: any): IProperty<any>[] {

            if (GameObjectEditorSupport.hasObjectComponent(obj, ArcadeComponent)) {

                const props = this.getSizeOrRadiusProperties(obj);

                props.push(
                    ArcadeComponent.offset.x,
                    ArcadeComponent.offset.y
                );

                return props;
            }

            return [];
        }

        protected getSizeOrRadiusProperties(obj?: any): IProperty<any>[] {

            if (ArcadeComponent.isCircleBody(obj)) {

                return [
                    ArcadeComponent.radius
                ];
            }

            return [
                ArcadeComponent.size.x,
                ArcadeComponent.size.y
            ];
        }

        async onActivated(args: editor.tools.ISceneToolContextArgs) {

            super.onActivated(args);

            for(const obj of args.objects) {

                if (!obj.getEditorSupport().hasComponent(ArcadeComponent)) {

                    return;
                }
            }

            const sections = [ArcadeGeometrySection.ID];

            const props: Set<IProperty<ISceneGameObject>> = new Set();

            for (const obj of args.objects) {

                const objProps = this.getProperties(obj);
                
                for(const prop of objProps) {

                    props.add(prop);
                }
            }

            await this.confirmUnlockProperty(args, [ArcadeComponent.offset.x, ArcadeComponent.offset.y], "body.offset", ...sections);

            await this.confirmUnlockProperty(args, [...props], "body size", ...sections);
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

            if (ArcadeComponent.isCircleBody(obj)) {

                this.renderCircle(obj, args, ctx);

            } else {

                this.renderRect(obj, args, ctx);
            }

            ctx.restore();
        }

        private renderRect(obj: Sprite, args: editor.tools.ISceneToolRenderArgs, ctx: CanvasRenderingContext2D) {

            const body = ArcadeComponent.getBody(obj);

            const p = new Phaser.Math.Vector2();

            const origin = obj.getEditorSupport().computeDisplayOrigin();

            if (obj instanceof Container) {

                origin.displayOriginX = 0;
                origin.displayOriginY = 0;
            }

            let x1 = body.offset.x - origin.displayOriginX;
            let y1 = body.offset.y - origin.displayOriginY;
            let x2 = x1 + body.width;
            let y2 = y1 + body.height;

            const tx = obj.getWorldTransformMatrix();
            // removes rotation
            tx.rotate(-tx.rotation);
            tx.transformPoint(x1, y1, p);
            x1 = p.x;
            y1 = p.y;

            tx.transformPoint(x2, y2, p);
            x2 = p.x;
            y2 = p.y;

            const p1 = args.camera.getScreenPoint(x1, y1);
            const p2 = args.camera.getScreenPoint(x2, y2);

            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.strokeRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

            ctx.strokeStyle = ArcadeBodyTool.BODY_TOOL_COLOR;
            ctx.lineWidth = 1;
            ctx.strokeRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
        }

        private renderCircle(obj: Sprite, args: editor.tools.ISceneToolRenderArgs, ctx: CanvasRenderingContext2D) {

            const body = ArcadeComponent.getBody(obj);

            const p = new Phaser.Math.Vector2();

            const origin = obj.getEditorSupport().computeDisplayOrigin();

            if (obj instanceof Container) {

                origin.displayOriginX = 0;
                origin.displayOriginY = 0;
            }

            const bodyRadius = ArcadeComponent.radius.getValue(obj);
            let x1 = body.offset.x - origin.displayOriginX;
            let y1 = body.offset.y - origin.displayOriginY;
            let x2 = x1 + bodyRadius * 2;
            let y2 = y1 + bodyRadius * 2;

            const tx = obj.getWorldTransformMatrix();
            // removes rotation
            tx.rotate(-tx.rotation);
            tx.transformPoint(x1, y1, p);
            x1 = p.x;
            y1 = p.y;

            tx.transformPoint(x2, y2, p);
            x2 = p.x;
            y2 = p.y;

            const p1 = args.camera.getScreenPoint(x1, y1);
            const p2 = args.camera.getScreenPoint(x2, y2);

            const r = (p2.x - p1.x) / 2;
            const x = p1.x + r;
            const y = p1.y + r;

            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(x, y, r, r, 0, 0, 360);
            ctx.stroke();

            ctx.strokeStyle = ArcadeBodyTool.BODY_TOOL_COLOR;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(x, y, r, r, 0, 0, 360);
            ctx.stroke();
        }
    }
}