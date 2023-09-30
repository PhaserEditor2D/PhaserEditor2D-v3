/// <reference path="../Rect.ts"/>
/// <reference path="../Controls.ts"/>
/// <reference path="./LabelCellRenderer.ts"/>
/// <reference path="./ImageCellRenderer.ts"/>

namespace colibri.ui.controls.viewers {

    export abstract class Viewer extends Control {

        public eventOpenItem = new ListenerList();
        public eventDeletePressed = new ListenerList();

        private _contentProvider: IContentProvider;
        private _cellRendererProvider: ICellRendererProvider;
        private _labelProvider: ILabelProvider = null;
        private _styledLabelProvider: IStyledLabelProvider;
        private _input: any;
        private _cellSize: number;
        protected _expandedObjects: Set<any>;
        private _selectedObjects: Set<any>;
        protected _context: CanvasRenderingContext2D;
        protected _paintItems: PaintItem[];
        private _lastSelectedItemIndex: number = -1;
        protected _contentHeight: number = 0;
        private _filterText: string;
        protected _filterIncludeSet: Set<any>;
        protected _filterMatches: Map<string, IMatchResult>;
        private _highlightMatches: boolean;
        private _viewerId: string;
        private _preloadEnabled = true;
        private _filterOnRepaintEnabled = true;
        private _searchEngine: ISearchEngine;

        constructor(id: string, ...classList: string[]) {
            super("canvas", "Viewer");

            this._viewerId = id;
            this._filterText = "";
            this._cellSize = 48;

            this.getElement().tabIndex = 1;
            this.getElement().draggable = true;

            this.initContext();

            this._input = null;
            this._expandedObjects = new Set();
            this._selectedObjects = new Set();
            this._filterIncludeSet = new Set();
            this._filterMatches = new Map();

            this._highlightMatches = true;
            this._searchEngine = new MultiWordSearchEngine();

            this.initListeners();

            this.restoreCellSize();
        }

        isHighlightMatches() {

            return this._highlightMatches;
        }
        setHighlightMatches(highlightMatches: boolean) {

            this._highlightMatches = highlightMatches;
        }

        getSearchEngine() {

            return this._searchEngine;
        }

        setSearchEngine(engine: ISearchEngine) {

            this._searchEngine = engine;
        }

        getViewerId() {

            return this._viewerId;
        }

        restoreCellSize() {

            const key = "Viewer.cellSize." + this._viewerId;
            const value = localStorage.getItem(key);

            if (value) {

                const size = Number.parseInt(value, 10);

                if (!isNaN(size)) {

                    this._cellSize = size;
                }
            }
        }

        saveCellSize() {

            const key = "Viewer.cellSize." + this._viewerId;

            localStorage.setItem(key, this._cellSize.toString());
        }

        private initListeners() {

            const canvas = this.getCanvas();

            canvas.addEventListener("mouseup", e => this.onMouseUp(e));
            canvas.addEventListener("wheel", e => this.onWheel(e));
            canvas.addEventListener("keydown", e => this.onKeyDown(e));
            canvas.addEventListener("dblclick", e => this.onDoubleClick(e));
            canvas.addEventListener("dragstart", e => this.onDragStart(e));
        }

        private onKeyDown(e: KeyboardEvent) {

            switch (e.key) {

                case "ArrowUp":
                case "ArrowLeft":

                    this.moveCursor(-1);
                    break;

                case "ArrowDown":
                case "ArrowRight":

                    this.moveCursor(1);
                    break;

                case "Delete":
                case "Backspace":

                    this.eventDeletePressed.fire(this.getSelection());
                    break;
            }
        }

        private moveCursor(dir: number) {

            const elem = this.getSelectionFirstElement();

            if (!elem) {
                return;
            }

            let i = this._paintItems.findIndex(item => item.data === elem);

            if (i >= 0) {

                i += dir;

                if (i >= 0 && i < this._paintItems.length) {

                    const data = this._paintItems[i].data;
                    const newSel = [data];
                    this.setSelection(newSel);
                    this.reveal(data);
                }
            }
        }

        private onDragStart(e: DragEvent) {

            const paintItemUnderCursor = this.getPaintItemAt(e);

            if (paintItemUnderCursor) {

                let dragObjects = [];

                {
                    const sel = this.getSelection();

                    if (new Set(sel).has(paintItemUnderCursor.data)) {
                        dragObjects = sel;
                    } else {
                        dragObjects = [paintItemUnderCursor.data];
                    }
                }

                Controls.setDragEventImage(e, (ctx, w, h) => {

                    for (const obj of dragObjects) {
                        const renderer = this.getCellRendererProvider().getCellRenderer(obj);
                        renderer.renderCell(new RenderCellArgs(ctx, 0, 0, w, h, obj, this, true));
                    }
                });

                const labels = dragObjects.map(obj => this.getLabelProvider().getLabel(obj)).join(",");

                e.dataTransfer.setData("plain/text", labels);

                Controls.setApplicationDragData(dragObjects);

            } else {

                e.preventDefault();
            }
        }

        getLabelProvider() {

            return this._labelProvider;
        }

        setLabelProvider(labelProvider: ILabelProvider) {

            this._labelProvider = labelProvider;
        }

        getStyledLabelProvider() {

            return this._styledLabelProvider;
        }

        setStyledLabelProvider(styledLabelProvider: IStyledLabelProvider) {

            this._styledLabelProvider = styledLabelProvider;

            if (!this._labelProvider && styledLabelProvider) {

                this._labelProvider = new LabelProviderFromStyledLabelProvider(styledLabelProvider);
            }
        }

        setFilterText(filterText: string) {

            this._filterText = filterText.toLowerCase();
        }

        getFilterText() {

            return this._filterText;
        }

        protected prepareFiltering(updateScroll: boolean) {

            if (updateScroll) {

                this.setScrollY(0);
            }

            this._filterIncludeSet.clear();
            this._filterMatches.clear();

            this._searchEngine.prepare(this.getFilterText());

            this.buildFilterIncludeMap();
        }

        isFilterIncluded(obj: any) {

            return this._filterIncludeSet.has(obj) || this._filterText.length === 0;
        }

        protected abstract buildFilterIncludeMap();

        protected matches(obj: any): boolean {

            const labelProvider = this.getLabelProvider();

            if (labelProvider === null) {

                return true;
            }

            const label = labelProvider.getLabel(obj);

            const result = this._searchEngine.matches(label);

            if (this._highlightMatches) {

                if (result.matches) {

                    this._filterMatches.set(label, result);

                } else {

                    this._filterMatches.delete(label);
                }
            }

            return result.matches;
        }

        getMatchesResult(label: string) {

            return this._filterMatches.get(label);
        }

        protected getPaintItemAt(e: MouseEvent): PaintItem {

            for (const item of this._paintItems) {

                if (item.contains(e.offsetX, e.offsetY)) {

                    return item;
                }
            }

            return null;
        }

        getSelection() {

            const sel = [...this._selectedObjects];

            return sel;
        }

        getSelectionFirstElement() {

            const sel = this.getSelection();

            if (sel.length > 0) {

                return sel[0];
            }

            return null;
        }

        setSelection(selection: any[], notify = true) {

            this._selectedObjects = new Set(selection);

            if (notify) {

                this.fireSelectionChanged();
                this.repaint();
            }
        }

        abstract reveal(...objects: any[]): Promise<void>;

        abstract revealAndSelect(...objects: any[]): Promise<void>;

        private fireSelectionChanged() {

            this.eventSelectionChanged.fire(this.getSelection());
        }

        escape(): void {

            if (this._selectedObjects.size > 0) {
                this._selectedObjects.clear();
                this.repaint();
                this.fireSelectionChanged();
            }
        }

        private onWheel(e: WheelEvent): void {

            e.preventDefault();

            if (!e.shiftKey) {

                return;
            }

            this.setCellSize(this.getCellSize() - e.deltaY / 2);

            // if (e.deltaY < 0) {

            //    this.setCellSize(this.getCellSize() + ROW_HEIGHT);

            // } else if (this._cellSize > ICON_SIZE) {

            //     this.setCellSize(this.getCellSize() - ROW_HEIGHT);
            // }

            this.saveCellSize();

            this.repaint();
        }

        private onDoubleClick(e: MouseEvent) {

            const item = this.getPaintItemAt(e);

            if (item) {

                this.eventOpenItem.fire(item.data);
            }
        }

        protected abstract canSelectAtPoint(e: MouseEvent): boolean;

        onMouseUp(e: MouseEvent): void {

            if (Controls.getMouseDownElement() !== e.target) {

                return;
            }

            if (e.button !== 0 && e.button !== 2) {

                return;
            }

            if (!this.canSelectAtPoint(e)) {

                return;
            }

            const item = this.getPaintItemAt(e);

            let selChanged = false;

            if (item === null) {

                this._selectedObjects.clear();

                selChanged = true;

            } else {

                const data = item.data;

                if (e.button === 2 && this._selectedObjects.size === 1) {

                    this._selectedObjects = new Set([data]);
                    selChanged = true;

                } else {

                    if (e.button === 2) {

                        this._selectedObjects.add(data);

                        selChanged = true;

                    } else if (e.ctrlKey || e.metaKey) {

                        if (this._selectedObjects.has(data)) {

                            this._selectedObjects.delete(data);

                        } else {

                            this._selectedObjects.add(data);
                        }

                        selChanged = true;

                    } else if (e.shiftKey) {

                        if (this._lastSelectedItemIndex >= 0 && this._lastSelectedItemIndex !== item.index) {

                            const start = Math.min(this._lastSelectedItemIndex, item.index);
                            const end = Math.max(this._lastSelectedItemIndex, item.index);

                            this.repaintNow(true);

                            for (let i = start; i <= end; i++) {

                                const obj = this._paintItems[i].data;
                                this._selectedObjects.add(obj);
                            }

                            selChanged = true;
                        }
                    } else {

                        this._selectedObjects.clear();
                        this._selectedObjects.add(data);
                        selChanged = true;
                    }
                }
            }

            if (selChanged) {

                this.repaint();

                this.fireSelectionChanged();

                this._lastSelectedItemIndex = item ? item.index : 0;
            }
        }

        private initContext(): void {

            this._context = this.getCanvas().getContext("2d");
            this._context.imageSmoothingEnabled = false;
            this._context.font = `${controls.getCanvasFontHeight()}px sans-serif`;

            Controls.adjustCanvasDPI(this.getCanvas());
        }

        setExpanded(obj: any, expanded: boolean): void {

            if (expanded) {

                this._expandedObjects.add(obj);

            } else {

                this._expandedObjects.delete(obj);
            }
        }

        isExpanded(obj: any) {

            return this._expandedObjects.has(obj);
        }

        getExpandedObjects() {

            return this._expandedObjects;
        }

        isCollapsed(obj: any) {

            return !this.isExpanded(obj);
        }

        collapseAll() {

            this._expandedObjects = new Set();

            this.setScrollY(0);
        }

        isSelected(obj: any) {

            return this._selectedObjects.has(obj);
        }

        setFilterOnRepaintDisabled() {

            this._filterOnRepaintEnabled = false;
        }

        setPreloadDisabled() {

            this._preloadEnabled = false;
        }

        protected paintTreeHandler(x: number, y: number, collapsed: boolean): void {

            if (collapsed) {

                this._context.strokeStyle = "#000";
                this._context.strokeRect(x, y, ICON_SIZE, ICON_SIZE);

            } else {

                this._context.fillStyle = "#000";
                this._context.fillRect(x, y, ICON_SIZE, ICON_SIZE);
            }
        }

        async repaint(fullRepaint = false) {

            if (this._filterOnRepaintEnabled) {

                this.prepareFiltering(fullRepaint);
            }

            this.repaintNow(fullRepaint);

            if (this._preloadEnabled) {

                this.preload(this._paintItems).then(result => {

                    if (result === PreloadResult.RESOURCES_LOADED) {

                        this.repaintNow(fullRepaint);
                    }
                });
            }

            this.updateScrollPane();
        }

        private updateScrollPane() {

            const pane = this.getContainer()?.getContainer();

            if (pane instanceof ScrollPane) {

                pane.updateScroll(this._contentHeight);
            }
        }

        protected repaintNow(fullRepaint: boolean): void {

            this._paintItems = [];

            const canvas = this.getCanvas();

            this._context.clearRect(0, 0, canvas.width, canvas.height);

            if (this._cellRendererProvider && this._contentProvider && this._input !== null) {

                this.paint(fullRepaint);

            } else {

                this._contentHeight = 0;
            }
        }

        private async preload(paintItems: PaintItem[]): Promise<PreloadResult> {

            const viewer = this;

            const rendererProvider = this.getCellRendererProvider();

            let result = PreloadResult.NOTHING_LOADED;

            for (const paintItem of paintItems) {

                const obj = paintItem.data;

                const renderer = rendererProvider.getCellRenderer(obj);

                const itemResult = await renderer.preload(new PreloadCellArgs(obj, viewer));

                result = Math.max(itemResult, result);
            }

            return result;
        }

        paintItemBackground(obj: any, x: number, y: number, w: number, h: number, radius: number = 0): void {

            let fillStyle = null;

            if (this.isSelected(obj)) {

                fillStyle = Controls.getTheme().viewerSelectionBackground;
            }

            if (fillStyle != null) {

                this._context.save();

                this._context.strokeStyle = fillStyle;
                this._context.fillStyle = fillStyle;

                if (radius > 0) {

                    this._context.lineJoin = "round";
                    this._context.lineWidth = radius;
                    this._context.fillRect(
                        Math.floor(x + (radius / 2)),
                        Math.floor(y + (radius / 2)),
                        Math.ceil(w - radius),
                        Math.ceil(h - radius));
                    this._context.strokeRect(
                        Math.floor(x + (radius / 2)),
                        Math.floor(y + (radius / 2)),
                        Math.ceil(w - radius),
                        Math.ceil(h - radius));

                } else {

                    this._context.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h));
                }

                this._context.restore();
            }
        }

        setScrollY(scrollY: number) {

            const b = this.getBounds();

            scrollY = Math.max(-this._contentHeight + b.height, scrollY);
            scrollY = Math.min(0, scrollY);

            super.setScrollY(scrollY);

            this.repaint();
        }

        layout(): void {

            const b = this.getBounds();

            if (this.isHandlePosition()) {

                ui.controls.setElementBounds(this.getElement(), {
                    x: b.x,
                    y: b.y,
                    width: Math.floor(b.width),
                    height: Math.floor(b.height)
                });

            } else {

                ui.controls.setElementBounds(this.getElement(), {
                    width: Math.floor(b.width),
                    height: Math.floor(b.height)
                });
            }

            const canvas = this.getCanvas();

            canvas.width = Math.floor(b.width);
            canvas.height = Math.floor(b.height);

            this.initContext();

            this.repaint();
        }

        protected abstract paint(fullPaint: boolean): void;

        getCanvas(): HTMLCanvasElement {

            return this.getElement() as HTMLCanvasElement;
        }

        getContext() {

            return this._context;
        }

        getCellSize() {

            return this._cellSize;
        }

        setCellSize(cellSize: number, restoreSavedSize = false): void {

            this._cellSize = Math.max(ROW_HEIGHT, cellSize);

            if (restoreSavedSize) {

                this.restoreCellSize();
            }
        }

        getContentProvider() {

            return this._contentProvider;
        }

        setContentProvider(contentProvider: IContentProvider): void {

            this._contentProvider = contentProvider;
        }

        getCellRendererProvider() {

            return this._cellRendererProvider;
        }

        setCellRendererProvider(cellRendererProvider: ICellRendererProvider): void {

            this._cellRendererProvider = cellRendererProvider;
        }

        getInput() {

            return this._input;
        }

        setInput(input: any): void {

            this._input = input;
        }

        selectFirst() {

            const input = this.getInput();

            if (Array.isArray(input) && input.length > 0) {

                this.setSelection([input[0]]);
            }
        }

        getState(): ViewerState {

            return {
                filterText: this._filterText,
                expandedObjects: this._expandedObjects,
                selectedObjects: this._selectedObjects,
                cellSize: this._cellSize
            };
        }

        setState(state: ViewerState): void {

            this._expandedObjects = state.expandedObjects;
            this._selectedObjects = state.selectedObjects;

            if (state.filterText !== this.getFilterText()) {

                this.setFilterText(state.filterText);
            }

            if (state.cellSize !== this.getCellSize()) {

                this.setCellSize(state.cellSize);
            }
        }

        selectAll() {

            // first, compute all paintItems
            this.repaintNow(true);

            this.setSelection(this._paintItems.map(item => item.data));
        }
    }

    export declare type ViewerState = {

        expandedObjects: Set<any>,
        selectedObjects: Set<any>,
        filterText: string,
        cellSize: number
    };
}