namespace phasereditor2d.scene.ui.sceneobjects {

    export class RotateLineToolItem extends editor.tools.SceneToolItem {

        private _start: boolean;

        constructor(start: boolean) {
            super();

            this._start = start;
        }

        render(args: editor.tools.ISceneToolRenderArgs) {

            let globalStartAngle = 0;
            let globalEndAngle = 0;

            for (const obj of args.objects) {

                const sprite = obj as any as Phaser.GameObjects.Sprite;

                const endAngle = this.globalAngle(sprite as unknown as Phaser.GameObjects.Sprite);
                let startAngle = 0;

                if (args.localCoords) {

                    if (sprite.parentContainer) {

                        startAngle = this.globalAngle(sprite.parentContainer as any);
                    }
                }

                globalStartAngle += startAngle;
                globalEndAngle += endAngle;
            }

            const len = args.objects.length;

            globalStartAngle /= len;
            globalEndAngle /= len;

            const angle = this._start ? globalStartAngle : globalEndAngle;

            const point = this.getAvgScreenPointOfObjects(args);

            const ctx = args.canvasContext;

            ctx.save();

            ctx.translate(point.x, point.y);
            ctx.rotate(Phaser.Math.DegToRad(angle));

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(100, 0);

            ctx.strokeStyle = "#000";
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.strokeStyle = args.canEdit ? RotateToolItem.COLOR : editor.tools.SceneTool.COLOR_CANNOT_EDIT;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.restore();
        }

        containsPoint(args: editor.tools.ISceneToolDragEventArgs): boolean {
            return false;
        }

        onStartDrag(args: editor.tools.ISceneToolDragEventArgs): void {
            // nothing
        }

        onDrag(args: editor.tools.ISceneToolDragEventArgs): void {
            // nothing
        }

        onStopDrag(args: editor.tools.ISceneToolDragEventArgs): void {
            // nothing
        }
    }
}