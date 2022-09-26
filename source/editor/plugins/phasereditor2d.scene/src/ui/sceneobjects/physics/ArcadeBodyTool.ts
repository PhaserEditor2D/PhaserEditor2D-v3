namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeBodyTool extends BaseObjectTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.ArcadeBodyTool";

        constructor() {
            super({
                id: ArcadeBodyTool.ID,
                command: editor.commands.CMD_EDIT_ARCADE_BODY
            }, ArcadeComponent.size.x, ArcadeComponent.size.y);

            this.addItems(
                new ArcadeBodySizeToolItem(1, 0.5),
                new ArcadeBodySizeToolItem(1, 1),
                new ArcadeBodySizeToolItem(0.5, 1),
                new ArcadeBodyOffsetToolItem(0, 0),
                new ArcadeBodyOffsetToolItem(0.5, 0),
                new ArcadeBodyOffsetToolItem(0, 0.5),
            );
        }

        onActivated(args: editor.tools.ISceneToolContextArgs) {

            super.onActivated(args);

            const sections = [ArcadeGeometrySection.ID];

            this.confirmUnlockProperty(args, this.getProperties(), "size", ...sections);
        }

        render(args: editor.tools.ISceneToolRenderArgs): void {

            for (const obj of args.objects) {

                if (obj.getEditorSupport().hasComponent(ArcadeComponent)) {

                    this.renderObj(args, obj as ArcadeObject);
                }
            }

            super.render(args);
        }

        private renderObj(args: editor.tools.ISceneToolRenderArgs, obj: ArcadeObject) {

            const ctx = args.canvasContext;

            ctx.save();

            ctx.strokeStyle = "purple";
            ctx.lineWidth = 3;

            const body = obj.body;

            let pos = body.position;
            pos.x = 0;
            pos.y = 0;

            // if (this.isCircle) {
            //      const x = pos.x + body.halfWidth;
            //      const y = pos.y + body.halfHeight;
            //      graphic.strokeCircle(x, y, this.width / 2);
            // }
            // else 
            {
                //  Only draw the sides where checkCollision is true, similar to debugger in layer

                const p = new Phaser.Math.Vector2();

                let x1 = pos.x + body.offset.x;
                let y1 = pos.y + body.offset.y;
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

                ctx.strokeRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
            }

            ctx.restore();
        }
    }
}