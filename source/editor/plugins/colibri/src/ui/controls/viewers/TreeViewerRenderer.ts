namespace colibri.ui.controls.viewers {

    export class TreeViewerRenderer {

        private _viewer: TreeViewer;
        protected _contentHeight: number;
        protected _fullPaint: boolean;
        protected _itemIndex: number;

        constructor(viewer: TreeViewer, cellSize: number = ROW_HEIGHT) {

            this._viewer = viewer;

            this._viewer.setCellSize(cellSize);

            this._viewer.restoreCellSize();
        }

        getViewer() {
            return this._viewer;
        }

        paint(fullPaint: boolean): {
            contentHeight: number,
            paintItems: PaintItem[],
            treeIconList: TreeIconInfo[]
        } {
            const viewer = this._viewer;
            this._fullPaint = fullPaint;
            this._itemIndex = 0;

            const x = 0;
            const y = viewer.getScrollY();

            const contentProvider = viewer.getContentProvider();

            const roots = contentProvider.getRoots(viewer.getInput());
            const treeIconList: TreeIconInfo[] = [];
            const paintItems: PaintItem[] = [];

            this._contentHeight = Number.MIN_SAFE_INTEGER;

            this.paintItems(roots, treeIconList, paintItems, null, x, y);

            // for (const paintItem of paintItems) {

            //     contentHeight = Math.max(paintItem.y + paintItem.h, contentHeight);
            // }

            this._contentHeight -= viewer.getScrollY();

            return {
                contentHeight: this._contentHeight,
                treeIconList: treeIconList,
                paintItems: paintItems
            };

        }

        protected paintItems(
            objects: any[], treeIconList: TreeIconInfo[], paintItems: PaintItem[],
            parentPaintItem: PaintItem, x: number, y: number) {

            const viewer = this._viewer;

            const context = viewer.getContext();

            const b = viewer.getBounds();

            for (const obj of objects) {

                const children = viewer.getContentProvider().getChildren(obj);
                const expanded = viewer.isExpanded(obj);
                let newParentPaintItem: PaintItem = null;

                if (viewer.isFilterIncluded(obj)) {

                    const renderer = viewer.getCellRendererProvider().getCellRenderer(obj);

                    const args = new RenderCellArgs(
                        context, x + LABEL_MARGIN, y, b.width - x - LABEL_MARGIN, 0, obj, viewer);

                    const cellHeight = renderer.cellHeight(args);
                    args.h = cellHeight;

                    viewer.paintItemBackground(obj, 0, y, b.width, cellHeight);

                    let isItemVisible = false;

                    if (y > -viewer.getCellSize() && y < b.height) {

                        // render tree icon
                        if (children.length > 0) {

                            const iconY = y + (cellHeight - TREE_ICON_SIZE) / 2;

                            const themeIcon = ColibriPlugin.getInstance()
                                .getIcon(expanded ? ICON_CONTROL_TREE_COLLAPSE : ICON_CONTROL_TREE_EXPAND);

                            let treeIcon: IImage = themeIcon;

                            if (viewer.isSelected(obj)) {

                                treeIcon = themeIcon.getNegativeThemeImage();
                            }

                            treeIcon.paint(context, x, iconY, TREE_ICON_SIZE, TREE_ICON_SIZE, false);

                            treeIconList.push({
                                rect: new Rect(x, iconY, TREE_ICON_SIZE, TREE_ICON_SIZE),
                                obj: obj
                            });
                        }

                        isItemVisible = true;

                        this.renderTreeCell(args, renderer);
                    }

                    if (isItemVisible || this._fullPaint) {

                        const item = new PaintItem(this._itemIndex, obj, parentPaintItem, isItemVisible);
                        item.set(args.x, args.y, args.w, args.h);
                        paintItems.push(item);

                        newParentPaintItem = item;
                    }

                    this._itemIndex++;

                    this._contentHeight = Math.max(this._contentHeight, args.y + args.h);

                    y += cellHeight;

                }

                if (expanded) {

                    const result = this.paintItems(
                        children, treeIconList, paintItems, newParentPaintItem, x + LABEL_MARGIN, y);

                    y = result.y;
                }
            }

            return { x: x, y: y };
        }

        private renderTreeCell(args: RenderCellArgs, renderer: ICellRenderer): void {

            let x = args.x;
            let y = args.y;

            const ctx = args.canvasContext;
            ctx.fillStyle = Controls.getTheme().viewerForeground;

            let args2: RenderCellArgs;

            const renderCell = !(renderer instanceof EmptyCellRenderer);

            if (args.h <= ROW_HEIGHT) {

                args2 = new RenderCellArgs(
                    args.canvasContext, args.x, args.y, TREE_ICON_SIZE, args.h, args.obj, args.viewer);

                if (renderCell) {

                    x += 20;
                }

                y += 15;

            } else if (renderer.layout === "full-width" && args.h > ROW_HEIGHT * 2) {

                args2 = new RenderCellArgs(
                    args.canvasContext, args.x, args.y, args.w, args.h - 20, args.obj, args.viewer);

                y += args2.h + 15;

            } else {

                args2 = new RenderCellArgs(
                    args.canvasContext, args.x, args.y, args.h, args.h, args.obj, args.viewer);

                if (renderCell) {

                    x += args.h + 4;
                    y += args.h / 2 + controls.getCanvasFontHeight() / 2;

                } else {

                    y += 15;
                }
            }

            ctx.save();

            this.prepareContextForRenderCell(args2);

            if (renderCell) {

                renderer.renderCell(args2);
            }

            ctx.restore();

            ctx.save();

            this.prepareContextForText(args);

            this.renderLabel(args, x, y);

            if (args.viewer.isHighlightMatches() && args.viewer.getFilterText().length > 0) {

                this.defaultRenderMatchHighlight(args, x, y);
            }

            ctx.restore();
        }

        protected renderMatchHighlight(args: RenderCellArgs, x: number, y: number, label: string) {

            const result = args.viewer.getMatchesResult(label);

            if (result && result.matches) {

                const start = this.measureText(args, result.measureStart);
                const width = this.measureText(args, result.measureMatch);
                const cellRight = args.x + args.w;

                if (x + start > cellRight) {

                    return;
                }

                const ctx = args.canvasContext;

                ctx.save();

                const selected = args.viewer.isSelected(args.obj);

                const theme = controls.Controls.getTheme();

                ctx.strokeStyle = selected ? theme.viewerSelectionForeground : theme.viewerForeground;
                ctx.lineWidth = 1;

                ctx.beginPath();

                ctx.moveTo(x + start, y + 2 + 0.5);

                ctx.lineTo(Math.min(cellRight - 2, x + start + width), y + 2 + 0.5);

                ctx.stroke();

                ctx.closePath();

                ctx.restore();
            }
        }

        private defaultRenderMatchHighlight(args: RenderCellArgs, x: number, y: number) {

            const label = args.viewer.getLabelProvider().getLabel(args.obj);

            this.renderMatchHighlight(args, x, y, label);
        }

        protected renderLabel(args: RenderCellArgs, x: number, y: number) {

            const styledProvider = this._viewer.getStyledLabelProvider();

            const selected = this._viewer.isSelected(args.obj);

            if (!selected && styledProvider) {

                this.renderStyledLabel(args, x, y, styledProvider);

            } else {

                this.renderPlainLabel(args, x, y);
            }
        }

        protected renderPlainLabel(args: RenderCellArgs, x: number, y: number) {

            const label = args.viewer.getLabelProvider().getLabel(args.obj);

            args.canvasContext.fillText(label, x, y);
        }

        protected renderStyledLabel(args: RenderCellArgs, x: number, y: number, styledProvider: IStyledLabelProvider, maxLength = -1) {

            const dark = controls.Controls.getTheme().dark;

            const parts = styledProvider.getStyledTexts(args.obj, dark);

            let cursor = x;

            const ctx = args.canvasContext;

            ctx.save();

            let len = 0;

            for (const part of parts) {

                ctx.fillStyle = part.color;

                let text = part.text;

                if (maxLength > 0 && len + part.text.length > maxLength) {

                    text = text.substring(0, maxLength - len - 2) + "..";
                }

                ctx.fillText(text, cursor, y);

                const width = this.measureText(args, text);

                cursor += width;

                len += text.length;

                if (maxLength > 0 && len >= maxLength) {

                    break;
                }
            }

            ctx.restore();
        }

        protected measureText(args: RenderCellArgs, text: string): number {

            return args.canvasContext.measureText(text).width;
        }

        protected prepareContextForRenderCell(args: RenderCellArgs) {
            // nothing by default
        }

        protected prepareContextForText(args: RenderCellArgs) {

            args.canvasContext.font = getCanvasFontHeight() + "px " + FONT_FAMILY;

            if (args.viewer.isSelected(args.obj)) {

                args.canvasContext.fillStyle = Controls.getTheme().viewerSelectionForeground;
            }
        }
    }
}