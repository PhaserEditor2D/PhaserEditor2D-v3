/// <reference path="../ShapeBlockCellRenderer.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class RectangleBlockCellRenderer extends ShapeBlockCellRenderer {

        static _instance: RectangleBlockCellRenderer;

        static getInstance() {

            return this._instance ? this._instance : (this._instance = new RectangleBlockCellRenderer());
        }

        protected renderShapeCell(ctx: CanvasRenderingContext2D, args: controls.viewers.RenderCellArgs) {

            const size = Math.floor(Math.max(8, Math.floor(Math.min(args.w, args.h) * 0.5)));

            const x = Math.floor(args.x + (args.w - size) / 2);
            const y = Math.floor(args.y + (args.h - size) / 2);

            ctx.beginPath();
            ctx.rect(x, y, size, size);
            ctx.stroke();
        }
    }
}