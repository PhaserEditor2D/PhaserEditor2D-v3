/// <reference path="../ShapeBlockCellRenderer.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class PolygonBlockCellRenderer extends ShapeBlockCellRenderer {

        static _instance: PolygonBlockCellRenderer;

        static getInstance() {

            return this._instance ? this._instance : (this._instance = new PolygonBlockCellRenderer());
        }

        protected renderShapeCell(ctx: CanvasRenderingContext2D, args: controls.viewers.RenderCellArgs) {

            const size = Math.floor(Math.max(8, Math.floor(Math.min(args.w, args.h) * 0.5)));

            const x = Math.floor(args.x + args.w / 2);
            const y = Math.floor(args.y + args.h / 2);
            const r = Math.floor(size / 2);

            ctx.beginPath();
            ctx.moveTo(x - r / 2, y + r);
            ctx.lineTo(x - r, y);
            ctx.lineTo(x, y - r);
            ctx.lineTo(x + r, y);
            ctx.lineTo(x + r / 2, y + r);
            ctx.closePath();
            ctx.stroke();
        }
    }
}