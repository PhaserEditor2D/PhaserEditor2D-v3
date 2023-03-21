/// <reference path="./TreeViewerRenderer.ts" />

namespace colibri.ui.controls.viewers {

    export const TREE_RENDERER_GRID_PADDING = 5;

    const DARK_FILL_COLOR = "rgba(255, 255, 255, 0.05)";
    const DARK_BORDER_COLOR = "rgba(255, 255, 255, 0)";

    const LIGHT_FILL_COLOR = "rgba(255, 255, 255, 0.3)";
    const LIGHT_BORDER_COLOR = "rgba(255, 255, 255, 0.3)";

    const DARK_SHADOW_COLOR = "rgba(0, 0, 0, 0.2)";
    const DARK_CHILD_SHADOW_COLOR = "rgba(0, 0, 0, 0.4)";
    const DARK_CHILD_SHADOW_BORDER_COLOR = "rgba(0, 0, 0, 0.2)";

    const LIGHT_SHADOW_COLOR = "rgba(0, 0, 0, 0.1)";
    const LIGHT_CHILD_SHADOW_COLOR = "rgba(0, 0, 0, 0.2)";
    const LIGHT_CHILD_SHADOW_BORDER_COLOR = "rgba(255, 255, 255, 1)";

    export class GridTreeViewerRenderer extends TreeViewerRenderer {

        private _center: boolean;
        private _flat: boolean;
        private _isSectionCriteria: (obj: any) => boolean;
        private _isShadowChildCriteria: (obj: any) => boolean;
        private _paintItemShadow: boolean;

        constructor(viewer: TreeViewer, flat: boolean = false, center: boolean = false) {
            super(viewer);

            viewer.setCellSize(128);

            viewer.restoreCellSize();

            this._center = center;
            this._flat = flat;
            this._paintItemShadow = false;
        }

        static expandSections(viewer: TreeViewer) {

            const renderer = viewer.getTreeRenderer();

            if (renderer instanceof GridTreeViewerRenderer) {

                for (const root of viewer.getContentProvider().getRoots(viewer.getInput())) {

                    if (renderer.isSection(root)) {

                        viewer.setExpanded(root, true);
                    }
                }
            }

            viewer.repaint();
        }

        setPaintItemShadow(paintShadow: boolean) {

            this._paintItemShadow = paintShadow;

            this.getViewer().setCellSize(64, true);

            return this;
        }

        isPaintItemShadow() {

            return this._paintItemShadow;
        }

        setSectionCriteria(sectionCriteria: (obj: any) => boolean) {

            this._isSectionCriteria = sectionCriteria;

            return this;
        }

        getSectionCriteria() {

            return this._isSectionCriteria;
        }

        setShadowChildCriteria(shadowChildCriteria: (any) => boolean) {

            this._isShadowChildCriteria = shadowChildCriteria;

            return this;
        }

        getShadowChildCriteria() {

            return this._isShadowChildCriteria;
        }

        isSection(obj: any) {

            return this._isSectionCriteria ? this._isSectionCriteria(obj) : false;
        }

        isFlat() {
            return this._flat;
        }

        paint(fullPaint: boolean) {

            const result = super.paint(fullPaint);

            result.contentHeight += 10;

            return result;
        }

        protected paintItems(
            objects: any[], treeIconList: TreeIconInfo[], paintItems: PaintItem[],
            parentPaintItem: PaintItem, x: number, y: number) {

            const viewer = this.getViewer();

            let cellSize = viewer.getCellSize();

            if (this._flat) {

                const limit = 64;

                if (cellSize < limit) {

                    cellSize = limit;

                    viewer.setCellSize(cellSize);
                }

            } else {

                if (cellSize <= 48) {

                    return super.paintItems(objects, treeIconList, paintItems, parentPaintItem, x, y);
                }
            }

            const b = viewer.getBounds();

            const offset = this._center ?
                Math.floor(b.width % (viewer.getCellSize() + TREE_RENDERER_GRID_PADDING) / 2)
                : (this._isSectionCriteria === undefined ? TREE_RENDERER_GRID_PADDING : TREE_RENDERER_GRID_PADDING * 3);

            this._contentHeight = Number.MIN_SAFE_INTEGER;

            this.paintGrid(
                objects, treeIconList, paintItems, null, x + offset, y + TREE_RENDERER_GRID_PADDING, offset, 0, undefined, undefined);
        }

        private paintGrid(
            objects: any[], treeIconList: TreeIconInfo[], paintItems: PaintItem[],
            parentPaintItem: PaintItem, x: number, y: number, offset: number, depth: number, sectionStart: number, sectionEnd: number) {

            const theme = controls.Controls.getTheme();

            const hasSections = this._isSectionCriteria !== undefined;

            const viewer = this.getViewer();
            const labelProvider = viewer.getLabelProvider();
            const cellSize = Math.max(ROW_HEIGHT, viewer.getCellSize());
            const ctx = viewer.getContext();

            const b = viewer.getBounds();
            const included = objects.filter(obj => viewer.isFilterIncluded(obj));
            const lastObj = included.length === 0 ? null : included[included.length - 1];

            for (const obj of objects) {

                const children = viewer.getContentProvider().getChildren(obj);
                const expanded = viewer.isExpanded(obj);
                const isSection = this.isSection(obj);
                const canPaintChildren = isSection || !this._flat;
                let newParentPaintItem: PaintItem = null;

                if (viewer.isFilterIncluded(obj)) {

                    if (isSection) {

                        // drawing section

                        if (children.length > 0) {

                            if (paintItems.length > 0) {

                                if (x > offset) {

                                    if (hasSections) {

                                        y += cellSize + TREE_RENDERER_GRID_PADDING * 3; // add new line
                                    }

                                } else {

                                    y += TREE_RENDERER_GRID_PADDING * 2; // add new line
                                }
                            }

                            y += 20; // a text is rendered using the base, from bottom to top.

                            const rectY = y - 18;
                            const rectHeight = 25;
                            let isItemVisible = false;

                            // paint only if needed
                            if (y > -cellSize && rectY <= b.height) {

                                const label = labelProvider.getLabel(obj);

                                if (expanded) {

                                    this.drawPanelTop(ctx, 5, rectY, b.width - 10, rectHeight);

                                } else {

                                    this.drawPanelCollapsed(ctx, 5, rectY, b.width - 10, rectHeight);
                                }

                                if (children.length > 0) {

                                    const iconY = rectY + rectHeight / 2 - RENDER_ICON_SIZE / 2 + 1;

                                    const iconInfo = this.paintIcon(ctx, obj, 5, iconY, expanded, treeIconList);

                                    iconInfo.rect.set(0, rectY, b.width, rectHeight);
                                }

                                ctx.save();

                                ctx.fillStyle = theme.viewerForeground + "aa";

                                ctx.fillText(label, TREE_RENDERER_GRID_PADDING * 2 + 16, y);

                                ctx.restore();

                                isItemVisible = true;
                            }

                            sectionStart = rectY + rectHeight;
                            sectionEnd = sectionStart;

                            const item = new PaintItem(this._itemIndex, obj, parentPaintItem, isItemVisible);
                            item.set(0, rectY, b.width, rectHeight);
                            this._itemIndex++;

                            paintItems.push(item);
                            newParentPaintItem = item;

                            if (expanded) {

                                y += TREE_RENDERER_GRID_PADDING * 3;

                            } else {

                                // no idea why!
                                y += 2;
                            }

                            x = offset;
                        }

                        this._contentHeight = Math.max(this._contentHeight, y);

                        // end drawing section

                    } else {

                        const renderer = viewer.getCellRendererProvider().getCellRenderer(obj);

                        const args = new RenderCellArgs(ctx, x, y, cellSize, cellSize, obj, viewer, true);

                        let isItemVisible = false;

                        if (y > -cellSize && y < b.height) {

                            // render section row
                            if (y + cellSize > sectionEnd) {

                                const bottom = y + cellSize + TREE_RENDERER_GRID_PADDING * 2;

                                ctx.save();

                                // ctx.fillRect(5, sectionEnd, b.width - 10, bottom - sectionEnd);
                                this.drawPanelRow(ctx, 5, sectionEnd, b.width - 10, bottom - sectionEnd);

                                ctx.restore();

                                sectionEnd = bottom;
                            }

                            isItemVisible = true;

                            this.renderGridCell(args, renderer, depth, obj === lastObj);

                            // render tree icon
                            if (children.length > 0 && canPaintChildren) {

                                const iconY = y + (cellSize - TREE_ICON_SIZE) / 2;

                                this.paintIcon(ctx, obj, x - 5, iconY, expanded, treeIconList);
                            }
                        }

                        if (isItemVisible || this._fullPaint) {

                            const item = new PaintItem(this._itemIndex, obj, parentPaintItem, isItemVisible);

                            item.set(args.x, args.y, args.w, args.h);

                            paintItems.push(item);

                            newParentPaintItem = item;
                        }

                        this._itemIndex++;

                        this._contentHeight = Math.max(this._contentHeight, args.y + args.h);

                        x += cellSize + TREE_RENDERER_GRID_PADDING;

                        const areaWidth = b.width - (hasSections ? TREE_RENDERER_GRID_PADDING * 3 : TREE_RENDERER_GRID_PADDING);

                        if (x + cellSize > areaWidth) {

                            y += cellSize + TREE_RENDERER_GRID_PADDING;
                            x = offset;
                        }
                    }
                }

                if (expanded && canPaintChildren) {

                    const result = this.paintGrid(
                        children, treeIconList, paintItems, newParentPaintItem, x, y, offset, depth + 1, sectionStart, sectionEnd);

                    y = result.y;
                    x = result.x;

                    this._contentHeight = Math.max(this._contentHeight, y);

                    if (sectionEnd !== result.sectionEnd && depth === 0) {

                        this.drawPanelBottom(ctx, 5, result.sectionEnd, b.width - 10);
                    }

                    sectionStart = result.sectionStart;
                    sectionEnd = result.sectionEnd;
                }
            }

            return {
                x,
                y,
                sectionStart,
                sectionEnd
            };
        }

        private paintIcon(ctx: CanvasRenderingContext2D, obj: any, x: number, y: number, expanded: boolean, treeIconList: TreeIconInfo[]) {

            const viewer = this.getViewer();

            const isSection = this.isSection(obj);

            const themeIcon = ColibriPlugin.getInstance().getIcon(expanded ?
                (isSection ? ICON_CONTROL_SECTION_COLLAPSE : ICON_CONTROL_TREE_COLLAPSE_LEFT)
                : (isSection ? ICON_CONTROL_SECTION_EXPAND : ICON_CONTROL_TREE_EXPAND_LEFT));

            let icon: IImage = themeIcon;

            if (!isSection && viewer.isSelected(obj)) {

                icon = themeIcon.getNegativeThemeImage();
            }

            ctx.save();

            let iconX: number;

            if (isSection) {

                iconX = x + 5;

            } else {

                const cellSize = this.getViewer().getCellSize();
                iconX = x + cellSize - RENDER_ICON_SIZE + 5;
            }

            icon.paint(ctx, iconX, y, RENDER_ICON_SIZE, RENDER_ICON_SIZE, false);

            ctx.restore();

            const iconInfo = {
                rect: new Rect(iconX, y, RENDER_ICON_SIZE, RENDER_ICON_SIZE),
                obj: obj
            };

            treeIconList.push(iconInfo);

            return iconInfo;
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

                const labelProvider = args.viewer.getLabelProvider();
                const styledLabelProvider = args.viewer.getStyledLabelProvider();

                const label = labelProvider.getLabel(args.obj);

                const trimLabel = this.trimLabel(ctx, label, args.w - 10);

                const x2 = Math.max(x, x + args.w / 2 - trimLabel.textWidth / 2);

                const y2 = args.y + args.h - 5;

                if (styledLabelProvider && !selected) {

                    this.renderStyledLabel(args, x2, y2, styledLabelProvider, trimLabel.text.length);
                    
                } else {

                    ctx.fillText(trimLabel.text, x2, y2);
                }

                ctx.restore();

                if (args.viewer.isHighlightMatches() && args.viewer.getFilterText().length > 0) {

                    this.renderMatchHighlight(args, x2, y2, label);
                }
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

            const theme = Controls.getTheme();

            // originally was (0, 0, 0, 0.2)
            const shadowColor = theme.dark ? DARK_SHADOW_COLOR : LIGHT_SHADOW_COLOR;
            const childShadowColor = theme.dark ? DARK_CHILD_SHADOW_COLOR : LIGHT_CHILD_SHADOW_COLOR;
            const childShadowBorderColor = theme.dark ? DARK_CHILD_SHADOW_BORDER_COLOR : LIGHT_CHILD_SHADOW_BORDER_COLOR;

            if (selected) {

                const ctx = args.canvasContext;

                ctx.save();

                ctx.fillStyle = Controls.getTheme().viewerSelectionBackground + "88";
                controls.Controls.drawRoundedRect(ctx, args.x, args.y, args.w, args.h);

                ctx.restore();
            }

            if (this._paintItemShadow) {

                const shadowAsChild = this._isShadowChildCriteria && this._isShadowChildCriteria(args.obj);

                const expanded = args.viewer.isExpanded(args.obj);

                if (shadowAsChild) {

                    const margin = controls.viewers.TREE_RENDERER_GRID_PADDING;

                    const ctx = args.canvasContext;

                    ctx.save();

                    ctx.fillStyle = childShadowColor;
                    ctx.strokeStyle = childShadowBorderColor;

                    if (isLastChild) {

                        controls.Controls.drawRoundedRect(
                            ctx, args.x - margin, args.y, args.w + margin, args.h, false, 0, 5, 5, 0);

                    } else {

                        ctx.beginPath()
                        ctx.moveTo(args.x + args.w, args.y + 2);
                        ctx.lineTo(args.x + args.w, args.y + args.h - 4);
                        ctx.stroke();

                        controls.Controls.drawRoundedRect(
                            ctx, args.x - margin, args.y, args.w + margin, args.h, false, 0, 0, 0, 0);
                    }

                    ctx.restore();

                } else /*if (!this.isFlat()) */ {

                    const ctx = args.canvasContext;

                    ctx.save();

                    ctx.fillStyle = shadowColor;
                    // ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";

                    if (expanded) {

                        controls.Controls.drawRoundedRect(ctx, args.x, args.y, args.w, args.h, false, 5, 0, 0, 5);

                    } else {

                        controls.Controls.drawRoundedRect(ctx, args.x, args.y, args.w, args.h, false, 5, 5, 5, 5);
                    }

                    ctx.restore();
                }
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

        private drawPanelBottom(
            ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {

            y = Math.floor(y);

            ctx.save();

            ctx.fillStyle = Controls.getTheme().dark ? DARK_FILL_COLOR : LIGHT_FILL_COLOR;
            ctx.strokeStyle = Controls.getTheme().dark ? DARK_BORDER_COLOR : LIGHT_BORDER_COLOR;

            ctx.clearRect(x - 5, y - 5, w + 10, 10);

            ctx.beginPath();
            ctx.moveTo(x + w, y - 5);
            ctx.quadraticCurveTo(x + w, y, x + w - 5, y);
            ctx.lineTo(x + 5, y);
            ctx.quadraticCurveTo(x, y, x, y - 5);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath()
            ctx.moveTo(x + w, y - 5);
            ctx.quadraticCurveTo(x + w, y, x + w - 5, y);
            ctx.lineTo(x + 5, y);
            ctx.quadraticCurveTo(x, y, x, y - 5);
            ctx.stroke();

            ctx.restore();
        }

        private drawPanelTop(
            ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {

            y = Math.floor(y);

            const topLeft = 5;
            const topRight = 5;
            const bottomRight = 0;
            const bottomLeft = 0;

            ctx.save();

            ctx.fillStyle = Controls.getTheme().dark ? DARK_FILL_COLOR : LIGHT_FILL_COLOR;
            ctx.strokeStyle = Controls.getTheme().dark ? DARK_BORDER_COLOR : LIGHT_BORDER_COLOR;

            // stroke

            ctx.beginPath();
            ctx.moveTo(x + topLeft, y);
            ctx.lineTo(x + w - topRight, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + topRight);
            ctx.lineTo(x + w, y + h - bottomRight);
            ctx.quadraticCurveTo(x + w, y + h, x + w - bottomRight, y + h);
            ctx.moveTo(x + bottomLeft, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - bottomLeft);
            ctx.lineTo(x, y + topLeft);
            ctx.quadraticCurveTo(x, y, x + topLeft, y);
            ctx.stroke();

            // fill

            ctx.beginPath();
            ctx.moveTo(x + topLeft, y);
            ctx.lineTo(x + w - topRight, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + topRight);
            ctx.lineTo(x + w, y + h - bottomRight);
            ctx.quadraticCurveTo(x + w, y + h, x + w - bottomRight, y + h);
            ctx.lineTo(x + bottomLeft, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - bottomLeft);
            ctx.lineTo(x, y + topLeft);
            ctx.quadraticCurveTo(x, y, x + topLeft, y);
            ctx.fill();
            ctx.restore();
        }

        drawPanelRow(
            ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {

            y = Math.floor(y);

            ctx.save();

            ctx.fillStyle = Controls.getTheme().dark ? DARK_FILL_COLOR : LIGHT_FILL_COLOR;
            ctx.strokeStyle = Controls.getTheme().dark ? DARK_BORDER_COLOR : LIGHT_BORDER_COLOR;

            ctx.fillRect(x, y, w, h);

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + h);
            ctx.moveTo(x + w, y);
            ctx.lineTo(x + w, y + h);
            ctx.closePath();
            ctx.stroke();

            ctx.restore();
        }

        private drawPanelCollapsed(
            ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {

            y = Math.floor(y);

            const c = TREE_RENDERER_GRID_PADDING;

            ctx.save();

            ctx.fillStyle = Controls.getTheme().dark ? DARK_FILL_COLOR : LIGHT_FILL_COLOR;
            ctx.strokeStyle = Controls.getTheme().dark ? DARK_BORDER_COLOR : LIGHT_BORDER_COLOR;

            // this.drawPrevBottomPanel(ctx, x, y, w);

            ctx.beginPath();
            ctx.moveTo(x + c, y);
            ctx.lineTo(x + w - c, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + c);
            ctx.lineTo(x + w, y + h - c);
            ctx.quadraticCurveTo(x + w, y + h, x + w - c, y + h);
            ctx.lineTo(x + c, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - c);
            ctx.lineTo(x, y + c);
            ctx.quadraticCurveTo(x, y, x + c, y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.restore();
        }
    }
}