/// <reference path="./SceneToolItem.ts" />

namespace phasereditor2d.scene.ui.editor.tools {

    export abstract class PointToolItem extends SceneToolItem implements ISceneToolItemXY {

        private _color: string;

        constructor(color: string) {
            super();

            this._color = color;
        }

        abstract getPoint(args: ISceneToolContextArgs): { x: number; y: number; };

        render(args: ISceneToolRenderArgs) {

            const point = this.getPoint(args);

            const ctx = args.canvasContext;

            ctx.fillStyle = args.canEdit ? this._color : editor.tools.SceneTool.COLOR_CANNOT_EDIT;

            ctx.beginPath();
            ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "#000";
            ctx.stroke();
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