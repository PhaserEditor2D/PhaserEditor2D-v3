namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;

    export class AssetPackTreeViewerRenderer extends controls.viewers.GridTreeViewerRenderer {

        constructor(viewer: controls.viewers.TreeViewer, flat: boolean) {
            super(viewer, flat, false);

            viewer.setCellSize(64);

            const types = core.TYPES.filter(type => type === core.ATLAS_TYPE || type.toLowerCase().indexOf("atlas") < 0);

            this.setSections(types);
        }

        renderCellBack(args: controls.viewers.RenderCellArgs, selected: boolean, isLastChild: boolean) {

            super.renderCellBack(args, selected, isLastChild);

            const isParent = this.isParent(args.obj);
            const isChild = this.isChild(args.obj);
            const expanded = args.viewer.isExpanded(args.obj);

            if (isChild) {

                const margin = controls.viewers.TREE_RENDERER_GRID_PADDING;

                const ctx = args.canvasContext;

                ctx.save();

                ctx.fillStyle = "rgba(0, 0, 0, 0.2)";

                if (isLastChild) {

                    controls.Controls.drawRoundedRect(ctx, args.x - margin, args.y, args.w + margin, args.h, 0, 5, 5, 0);

                } else {

                    controls.Controls.drawRoundedRect(ctx, args.x - margin, args.y, args.w + margin, args.h, 0, 0, 0, 0);

                }

                ctx.restore();

            } else if (isParent && !this.isFlat()) {

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

        protected isParent(obj: any) {

            if (obj instanceof core.AssetPackItem) {

                switch (obj.getType()) {
                    case core.ATLAS_TYPE:
                    case core.MULTI_ATLAS_TYPE:
                    case core.ATLAS_XML_TYPE:
                    case core.UNITY_ATLAS_TYPE:
                    case core.SPRITESHEET_TYPE:
                        return true;
                    default:
                        return false;
                }

            }

            return false;
        }

        protected isChild(obj: any) {
            return obj instanceof controls.ImageFrame;
        }

    }
}