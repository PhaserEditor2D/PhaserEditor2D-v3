namespace colibri.ui.controls.viewers {

    import controls = colibri.ui.controls;

    export class ShadowGridTreeViewerRenderer extends controls.viewers.GridTreeViewerRenderer {

        constructor(viewer: controls.viewers.TreeViewer, flat: boolean = false, center: boolean = false) {
            super(viewer, flat, center);

            viewer.setCellSize(64 * controls.DEVICE_PIXEL_RATIO, true);
        }

        renderCellBack(args: controls.viewers.RenderCellArgs, selected: boolean, isLastChild: boolean) {

            super.renderCellBack(args, selected, isLastChild);

            const shadowAsChild = this.isShadowAsChild(args.obj);
            const expanded = args.viewer.isExpanded(args.obj);

            if (shadowAsChild) {

                const margin = controls.viewers.TREE_RENDERER_GRID_PADDING;

                const ctx = args.canvasContext;

                ctx.save();

                ctx.fillStyle = "rgba(0, 0, 0, 0.2)";

                if (isLastChild) {

                    controls.Controls.drawRoundedRect(
                        ctx, args.x - margin, args.y, args.w + margin, args.h, 0, 5, 5, 0);

                } else {

                    controls.Controls.drawRoundedRect(
                        ctx, args.x - margin, args.y, args.w + margin, args.h, 0, 0, 0, 0);

                }

                ctx.restore();

            } else /*if (!this.isFlat()) */ {

                const ctx = args.canvasContext;

                ctx.save();

                ctx.fillStyle = "rgba(0, 0, 0, 0.2)";

                if (expanded) {

                    controls.Controls.drawRoundedRect(ctx, args.x, args.y, args.w, args.h, 5, 0, 0, 5);

                } else {

                    controls.Controls.drawRoundedRect(ctx, args.x, args.y, args.w, args.h, 5, 5, 5, 5);
                }

                ctx.restore();
            }
        }

        protected isShadowAsChild(obj: any) {
            return false;
        }
    }
}