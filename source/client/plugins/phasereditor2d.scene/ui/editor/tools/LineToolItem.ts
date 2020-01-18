/// <reference path="./SceneToolItem.ts" />

namespace phasereditor2d.scene.ui.editor.tools {

    export class LineToolItem extends SceneToolItem {

        private _tools: ISceneToolItemXY[];
        private _color: string;

        constructor(color: string, ...tools: ISceneToolItemXY[]) {
            super();

            this._color = color;
            this._tools = tools;
        }

        render(args: ISceneToolRenderArgs) {

            const ctx = args.context;

            ctx.save();

            ctx.beginPath();

            let start = true;

            for (const tool of this._tools) {

                const { x, y } = tool.getPoint(args);

                if (start) {

                    ctx.moveTo(x, y);

                } else {

                    ctx.lineTo(x, y);
                }

                start = false;
            }

            ctx.strokeStyle = "#000";
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.strokeStyle = this._color;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.restore();
        }

        containsPoint(args: ISceneToolDragEventArgs): boolean {
            return false;
        }

        onStartDrag(args: ISceneToolDragEventArgs): void {
            // nothing
        }

        onDrag(args: ISceneToolDragEventArgs): void {
            // nothing
        }

        onStopDrag(args: ISceneToolDragEventArgs): void {
            // nothing
        }
    }
}