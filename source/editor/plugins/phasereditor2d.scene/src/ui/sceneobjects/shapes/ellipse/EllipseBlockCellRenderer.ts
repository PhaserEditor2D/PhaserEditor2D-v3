/// <reference path="../ShapeBlockCellRenderer.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class EllipseBlockCellRenderer extends ShapeBlockCellRenderer {

        static _instance: EllipseBlockCellRenderer;

        static getInstance() {

            return this._instance ? this._instance : (this._instance = new EllipseBlockCellRenderer());
        }

        protected renderShapeCell(ctx: CanvasRenderingContext2D, args: controls.viewers.RenderCellArgs) {

            const size = Math.floor(Math.max(8, Math.floor(Math.min(args.w, args.h) * 0.5)));

            const x = Math.floor(args.x + args.w / 2);
            const y = Math.floor(args.y + args.h / 2);
            const r = Math.floor(size / 2);

            ctx.beginPath();
            ctx.ellipse(x, y, r, r, 0, 0, 360);
            ctx.stroke();
        }
    }
}