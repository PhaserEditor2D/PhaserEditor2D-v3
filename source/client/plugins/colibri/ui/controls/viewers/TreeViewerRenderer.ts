namespace colibri.ui.controls.viewers {

    export class TreeViewerRenderer {
        private _viewer: TreeViewer;

        constructor(viewer: TreeViewer, cellSize: number = ROW_HEIGHT) {
            this._viewer = viewer;
            this._viewer.setCellSize(cellSize);
        }

        getViewer() {
            return this._viewer;
        }

        paint(): {
            contentHeight: number,
            paintItems: PaintItem[],
            treeIconList: TreeIconInfo[]
        } {
            const viewer = this._viewer;

            let x = 0;
            let y = viewer.getScrollY();

            const contentProvider = viewer.getContentProvider();

            const roots = contentProvider.getRoots(viewer.getInput());
            const treeIconList: TreeIconInfo[] = [];
            const paintItems: PaintItem[] = [];

            this.paintItems(roots, treeIconList, paintItems, null, x, y);

            let contentHeight = Number.MIN_VALUE;

            for (const paintItem of paintItems) {
                contentHeight = Math.max(paintItem.y + paintItem.h, contentHeight);
            }

            contentHeight -= viewer.getScrollY();

            return {
                contentHeight: contentHeight,
                treeIconList: treeIconList,
                paintItems: paintItems
            };

        }

        protected paintItems(objects: any[], treeIconList: TreeIconInfo[], paintItems: PaintItem[], parentPaintItem: PaintItem, x: number, y: number) {

            const viewer = this._viewer;

            const context = viewer.getContext();

            const b = viewer.getBounds();

            for (let obj of objects) {

                const children = viewer.getContentProvider().getChildren(obj);
                const expanded = viewer.isExpanded(obj);
                let newParentPaintItem : PaintItem = null;

                if (viewer.isFilterIncluded(obj)) {

                    const renderer = viewer.getCellRendererProvider().getCellRenderer(obj);

                    const args = new RenderCellArgs(context, x + LABEL_MARGIN, y, b.width - x - LABEL_MARGIN, 0, obj, viewer);
                    const cellHeight = renderer.cellHeight(args);
                    args.h = cellHeight;

                    viewer.paintItemBackground(obj, 0, y, b.width, cellHeight);

                    if (y > -viewer.getCellSize() && y < b.height) {

                        // render tree icon
                        if (children.length > 0) {
                            const iconY = y + (cellHeight - TREE_ICON_SIZE) / 2;

                            const icon = Controls.getIcon(expanded ? ICON_CONTROL_TREE_COLLAPSE : ICON_CONTROL_TREE_EXPAND);
                            icon.paint(context, x, iconY, ICON_SIZE, ICON_SIZE, false);

                            treeIconList.push({
                                rect: new Rect(x, iconY, TREE_ICON_SIZE, TREE_ICON_SIZE),
                                obj: obj
                            });
                        }

                        this.renderTreeCell(args, renderer);
                    }

                    const item = new PaintItem(paintItems.length, obj, parentPaintItem);
                    item.set(args.x, args.y, args.w, args.h);
                    paintItems.push(item);

                    newParentPaintItem = item;

                    y += cellHeight;

                }

                if (expanded) {
                    const result = this.paintItems(children, treeIconList, paintItems, newParentPaintItem, x + LABEL_MARGIN, y);
                    y = result.y;
                }
            }

            return { x: x, y: y };
        }

        private renderTreeCell(args: RenderCellArgs, renderer: ICellRenderer): void {
            const label = args.viewer.getLabelProvider().getLabel(args.obj);
            let x = args.x;
            let y = args.y;

            const ctx = args.canvasContext;
            ctx.fillStyle = Controls.getTheme().viewerForeground;

            let args2: RenderCellArgs;
            if (args.h <= ROW_HEIGHT) {
                args2 = new RenderCellArgs(args.canvasContext, args.x, args.y, ICON_SIZE, args.h, args.obj, args.viewer);
                x += 20;
                y += 15;
            } else {
                args2 = new RenderCellArgs(args.canvasContext, args.x, args.y, args.w, args.h - 20, args.obj, args.viewer);
                y += args2.h + 15;
            }

            renderer.renderCell(args2);

            ctx.save();
            if (args.viewer.isSelected(args.obj)) {
                ctx.fillStyle = Controls.getTheme().viewerSelectionForeground;
            }
            ctx.fillText(label, x, y);
            ctx.restore();
        }
    }
}