/// <reference path="./TreeViewerRenderer.ts" />

namespace colibri.ui.controls.viewers {

    export const TREE_RENDERER_GRID_PADDING = 5;

    export class GridTreeViewerRenderer extends TreeViewerRenderer {

        private _center: boolean;
        private _flat: boolean;
        private _sections: string[];

        constructor(viewer: TreeViewer, flat: boolean = false, center: boolean = false) {
            super(viewer);

            viewer.setCellSize(128 * controls.DEVICE_PIXEL_RATIO);

            viewer.restoreCellSize();

            this._center = center;
            this._flat = flat;
            this._sections = [];
        }

        isFlat() {
            return this._flat;
        }

        setSections(sections: string[]) {
            this._sections = sections;
        }

        getSections() {
            return this._sections;
        }

        paint() {

            const result = super.paint();

            result.contentHeight += 10;

            return result;
        }

        protected paintItems(
            objects: any[], treeIconList: TreeIconInfo[], paintItems: PaintItem[],
            parentPaintItem: PaintItem, x: number, y: number) {

            const viewer = this.getViewer();
            const paintAreaHeight = viewer.getBounds().height;

            const labelProvider = viewer.getLabelProvider();

            let cellSize = viewer.getCellSize();

            if (this._flat) {

                const limit = 64 * controls.DEVICE_PIXEL_RATIO;

                if (cellSize < limit) {

                    cellSize = limit;

                    viewer.setCellSize(cellSize);
                }

            } else {

                if (cellSize <= 48) {

                    return super.paintItems(objects, treeIconList, paintItems, null, x, y);
                }
            }

            const b = viewer.getBounds();

            const sectionMargin = 20;

            if (this._sections.length > 0) {

                const ctx = viewer.getContext();

                let y2 = y + sectionMargin;
                const x2 = x + TREE_RENDERER_GRID_PADDING;

                let first = true;

                for (const section of this._sections) {

                    const objects2 = viewer
                        .getContentProvider()
                        .getChildren(section)
                        .filter(obj => viewer.isFilterIncluded(obj));

                    if (objects2.length === 0) {
                        continue;
                    }

                    if (first) {

                        first = false;

                    } else {

                        y2 += sectionMargin;
                    }

                    if (y2 >= -cellSize && y2 <= paintAreaHeight) {

                        const label = labelProvider.getLabel(section);

                        ctx.save();

                        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";

                        ctx.fillRect(0, y2 - 18, b.width, 25);

                        ctx.fillStyle = controls.Controls.getTheme().viewerForeground + "aa";

                        const textWidth = controls.Controls.measureTextWidth(ctx, label);

                        ctx.fillText(label, b.width / 2 - textWidth / 2, y2);

                        ctx.restore();
                    }

                    y2 += sectionMargin;

                    const result = this.paintItems2(
                        objects2, treeIconList, paintItems, null, x2, y2, TREE_RENDERER_GRID_PADDING, 0);

                    y2 = result.y + sectionMargin;

                    if (result.x > TREE_RENDERER_GRID_PADDING) {

                        y2 += cellSize;
                    }
                }

                return {
                    x: TREE_RENDERER_GRID_PADDING,
                    y: y2
                };

            } else {

                const offset = this._center ?
                    Math.floor(b.width % (viewer.getCellSize() + TREE_RENDERER_GRID_PADDING) / 2)
                    : TREE_RENDERER_GRID_PADDING;

                return this.paintItems2(
                    objects, treeIconList, paintItems, null, x + offset, y + TREE_RENDERER_GRID_PADDING, offset, 0);
            }
        }

        private paintItems2(
            objects: any[], treeIconList: TreeIconInfo[], paintItems: PaintItem[],
            parentPaintItem: PaintItem, x: number, y: number, offset: number, depth: number) {

            const viewer = this.getViewer();
            const cellSize = Math.max(ROW_HEIGHT, viewer.getCellSize());
            const context = viewer.getContext();

            const b = viewer.getBounds();
            const included = objects.filter(obj => viewer.isFilterIncluded(obj));
            const lastObj = included.length === 0 ? null : included[included.length - 1];

            for (const obj of objects) {

                const children = viewer.getContentProvider().getChildren(obj);
                const expanded = viewer.isExpanded(obj);
                let newParentPaintItem: PaintItem = null;

                if (viewer.isFilterIncluded(obj)) {

                    const renderer = viewer.getCellRendererProvider().getCellRenderer(obj);

                    const args = new RenderCellArgs(context, x, y, cellSize, cellSize, obj, viewer, true);

                    let isItemVisible = false;

                    if (y > -cellSize && y < b.height) {

                        // render tree icon
                        if (children.length > 0 && !this._flat) {

                            const iconY = y + (cellSize - TREE_ICON_SIZE) / 2;

                            const themeIcon = ColibriPlugin.getInstance().getIcon(expanded ?
                                ICON_CONTROL_TREE_COLLAPSE
                                : ICON_CONTROL_TREE_EXPAND);

                            let icon: IImage = themeIcon;

                            if (viewer.isSelected(obj)) {

                                icon = themeIcon.getNegativeThemeImage();
                            }

                            context.save();

                            const iconX = x + 5;

                            icon.paint(context, iconX, iconY, RENDER_ICON_SIZE, RENDER_ICON_SIZE, false);

                            context.restore();

                            treeIconList.push({
                                rect: new Rect(iconX, iconY, RENDER_ICON_SIZE, RENDER_ICON_SIZE),
                                obj: obj
                            });
                        }

                        isItemVisible = true;
                        this.renderGridCell(args, renderer, depth, obj === lastObj);
                    }

                    const item = new PaintItem(paintItems.length, obj, parentPaintItem, isItemVisible);

                    item.set(args.x, args.y, args.w, args.h);

                    paintItems.push(item);

                    newParentPaintItem = item;

                    x += cellSize + TREE_RENDERER_GRID_PADDING;

                    if (x + cellSize > b.width) {

                        y += cellSize + TREE_RENDERER_GRID_PADDING;
                        x = 0 + offset;
                    }
                }

                if (expanded && !this._flat) {

                    const result = this.paintItems2(
                        children, treeIconList, paintItems, newParentPaintItem, x, y, offset, depth + 1);
                    y = result.y;
                    x = result.x;
                }
            }

            return {
                x: x,
                y: y
            };
        }

        private renderGridCell(args: RenderCellArgs, renderer: ICellRenderer, depth: number, isLastChild: boolean) {

            const cellSize = args.viewer.getCellSize();
            const b = args.viewer.getBounds();
            const lineHeight = 20;
            const x = args.x;

            const ctx = args.canvasContext;

            const selected = args.viewer.isSelected(args.obj);

            let labelHeight: number;
            let visible: boolean;

            {

                labelHeight = lineHeight;

                visible = args.y > -(cellSize + labelHeight) && args.y < b.height;

                if (visible) {

                    this.renderCellBack(args, selected, isLastChild);

                    const args2 = new RenderCellArgs(args.canvasContext,
                        args.x + 3, args.y + 3,
                        args.w - 6, args.h - 6 - lineHeight,
                        args.obj, args.viewer, args.center
                    );

                    renderer.renderCell(args2);

                    this.renderCellFront(args, selected, isLastChild);

                    args.viewer.paintItemBackground(
                        args.obj, args.x, args.y + args.h - lineHeight, args.w, labelHeight, 10);
                }
            }

            if (visible) {

                ctx.save();

                if (selected) {

                    ctx.fillStyle = Controls.getTheme().viewerSelectionForeground;

                } else {

                    ctx.fillStyle = Controls.getTheme().viewerForeground;
                }

                this.prepareContextForText(args);


                const label = args.viewer.getLabelProvider().getLabel(args.obj);

                const trim = this.trimLabel(ctx, label, args.w);

                const x2 = Math.max(x, x + args.w / 2 - trim.textWidth / 2);

                ctx.fillText(trim.text, x2, args.y + args.h - 5);

                ctx.restore();
            }
        }

        private trimLabel(ctx: CanvasRenderingContext2D, label: string, maxWidth: number) {

            let text = "";
            let textWidth = 0;

            for (const c of label) {

                const test = text + c;

                textWidth = controls.Controls.measureTextWidth(ctx, test);

                if (textWidth > maxWidth) {

                    if (text.length > 2) {

                        text = text.substring(0, text.length - 2) + "..";
                    }

                    break;

                } else {

                    text += c;
                }
            }

            return {
                text,
                textWidth
            };
        }

        protected renderCellBack(args: RenderCellArgs, selected: boolean, isLastChild: boolean) {

            if (selected) {

                const ctx = args.canvasContext;

                ctx.save();

                ctx.fillStyle = Controls.getTheme().viewerSelectionBackground + "88";
                controls.Controls.drawRoundedRect(ctx, args.x, args.y, args.w, args.h);

                ctx.restore();
            }
        }

        protected renderCellFront(args: RenderCellArgs, selected: boolean, isLastChild: boolean) {

            if (selected) {

                const ctx = args.canvasContext;

                ctx.save();

                ctx.fillStyle = Controls.getTheme().viewerSelectionBackground + "44";
                // ctx.fillRect(args.x, args.y, args.w, args.h);
                controls.Controls.drawRoundedRect(ctx, args.x, args.y, args.w, args.h);

                ctx.restore();
            }
        }
    }
}