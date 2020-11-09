namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export abstract class ShapeBlockCellRenderer implements controls.viewers.ICellRenderer {

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const ctx = args.canvasContext;

            ctx.save();

            const selected = args.viewer.isSelected(args.obj);

            const theme = controls.Controls.getTheme();

            ctx.strokeStyle = selected ? theme.viewerSelectionForeground : theme.viewerForeground;

            ctx.translate(0.5, 0.5);

            this.renderShapeCell(ctx, args);

            ctx.restore();
        }

        protected abstract renderShapeCell(ctx: CanvasRenderingContext2D, args: controls.viewers.RenderCellArgs);

        cellHeight(args: controls.viewers.RenderCellArgs): number {

            return args.viewer.getCellSize();
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            return controls.PreloadResult.NOTHING_LOADED;
        }
    }
}