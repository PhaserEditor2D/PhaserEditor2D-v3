/// <reference path="./Viewer.ts"/>
/// <reference path="./EmptyTreeContentProvider.ts" />

namespace colibri.ui.controls.viewers {

    export const TREE_ICON_SIZE = RENDER_ICON_SIZE;
    export const LABEL_MARGIN = TREE_ICON_SIZE + 0;

    export declare type TreeIconInfo = {
        rect: Rect,
        obj: any
    };

    export class TreeViewer extends Viewer {

        private _treeRenderer: TreeViewerRenderer;
        private _treeIconList: TreeIconInfo[];

        constructor(id: string, ...classList: string[]) {
            super(id, "TreeViewer", ...classList);

            this.getCanvas().addEventListener("click", e => this.onClick(e));

            this._treeRenderer = new TreeViewerRenderer(this);

            this._treeIconList = [];

            this.setContentProvider(new controls.viewers.EmptyTreeContentProvider());
        }

        expandRoots(repaint = true) {

            const roots = this.getContentProvider().getRoots(this.getInput());

            for (const root of roots) {

                this.setExpanded(root, true);
            }

            if (repaint) {

                this.repaint();
            }
        }

        setExpandWhenOpenParentItem() {

            this.eventOpenItem.addListener(obj => {

                if (this.getContentProvider().getChildren(obj).length > 0) {

                    this.setExpanded(obj, !this.isExpanded(obj));

                    this.repaint();
                }
            });
        }

        async expandCollapseBranch() {

            const obj = this.getSelectionFirstElement();

            if (obj) {

                const children = this.getContentProvider().getChildren(obj);

                if (children.length > 0) {

                    this.setExpanded(obj, !this.isExpanded(obj));

                    this.repaint();

                } else {

                    const path = this.getObjectPath(obj);

                    // pop obj
                    path.pop();

                    // pop parent
                    const parent = path.pop();

                    if (parent) {

                        await this.reveal(parent);

                        this.setExpanded(parent, false);

                        this.setSelection([parent]);
                    }
                }
            }
        }

        getTreeRenderer() {

            return this._treeRenderer;
        }

        setTreeRenderer(treeRenderer: TreeViewerRenderer): void {

            this._treeRenderer = treeRenderer;
        }

        canSelectAtPoint(e: MouseEvent) {

            const icon = this.getTreeIconAtPoint(e);

            return icon === null;
        }

        async revealAndSelect(...objects: any[]): Promise<void> {

            await this.reveal(...objects);

            this.setSelection(objects);
        }

        async reveal(...objects: any[]): Promise<void> {

            if (objects.length === 0) {

                return;
            }

            for (const obj of objects) {

                const path = this.getObjectPath(obj);

                this.revealPath(path);
            }

            try {
                if (!(this.getContainer().getContainer() instanceof ScrollPane)) {
                    return;
                }
            } catch (e) {
                return;
            }

            const scrollPane = this.getContainer().getContainer() as ScrollPane;

            const paintResult = this.getTreeRenderer().paint(true);

            const objSet = new Set(objects);

            let found = false;

            let y = -this._contentHeight;

            const b = this.getBounds();

            const items = paintResult.paintItems;

            items.sort((i1, i2) => i1.y - i2.y);

            for (const item of items) {

                if (objSet.has(item.data)) {

                    y = (item.y - b.height / 2 + item.h / 2) - this.getScrollY();

                    found = true;

                    break;
                }
            }

            if (found) {

                this.setScrollY(-y);
                this.repaint();

                scrollPane.layout();
            }
        }

        private revealPath(path: any[]) {

            for (let i = 0; i < path.length - 1; i++) {

                this.setExpanded(path[i], true);
            }
        }

        findElementByLabel(label: string) {

            const list = this.getContentProvider().getRoots(this.getInput());

            return this.findElementByLabel_inList(list, label);
        }

        private findElementByLabel_inList(list: any[], label: string) {

            if (list) {

                for (const child of list) {

                    const found = this.findElementByLabel_inElement(child, label);

                    if (found) {

                        return found;
                    }
                }
            }

            return undefined;
        }

        private findElementByLabel_inElement(elem: any, label: string) {

            const elemLabel = this.getLabelProvider().getLabel(elem);

            if (label === elemLabel) {

                return elem;
            }

            const list = this.getContentProvider().getChildren(elem);

            return this.findElementByLabel_inList(list, label);
        }

        getObjectPath(obj: any) {

            const list = this.getContentProvider().getRoots(this.getInput());

            const path = [];

            this.getObjectPath2(obj, path, list);

            return path;
        }

        private getObjectPath2(obj: any, path: any[], children: any[]): boolean {

            const contentProvider = this.getContentProvider();

            for (const child of children) {

                path.push(child);

                if (obj === child) {

                    return true;
                }

                const newChildren = contentProvider.getChildren(child);

                const found = this.getObjectPath2(obj, path, newChildren);

                if (found) {

                    return true;
                }

                path.pop();
            }

            return false;
        }

        private getTreeIconAtPoint(e: MouseEvent) {

            for (const icon of this._treeIconList) {
                if (icon.rect.contains(e.offsetX, e.offsetY)) {
                    return icon;
                }
            }

            return null;
        }

        private onClick(e: MouseEvent) {

            const icon = this.getTreeIconAtPoint(e);

            if (icon) {

                this.setExpanded(icon.obj, !this.isExpanded(icon.obj));

                this.repaint();
            }
        }

        visitObjects(visitor: (obj: any) => void) {

            const provider = this.getContentProvider();

            const list = provider ? provider.getRoots(this.getInput()) : [];

            this.visitObjects2(list, visitor);
        }

        private visitObjects2(objects: any[], visitor: (obj: any) => void) {

            for (const obj of objects) {

                visitor(obj);

                if (this.isExpanded(obj) || this.getFilterText() !== "") {

                    const list = this.getContentProvider().getChildren(obj);

                    this.visitObjects2(list, visitor);
                }
            }
        }

        protected paint(fullPaint: boolean): void {

            const result = this._treeRenderer.paint(fullPaint);

            this._contentHeight = result.contentHeight;
            this._paintItems = result.paintItems;
            this._treeIconList = result.treeIconList;
        }

        getFirstVisibleElement() {

            if (this._paintItems && this._paintItems.length > 0) {

                return this._paintItems[0].data;
            }
        }

        getVisibleElements() {

            if (this._paintItems) {

                return this._paintItems.map(item => item.data);
            }

            return [];
        }

        setFilterText(filter: string) {

            super.setFilterText(filter);

            this.maybeFilter();
        }

        private _filterTime = 0;
        private _token = 0;
        private _delayOnManyChars = 100;
        private _delayOnFewChars = 200;
        private _howMuchIsFewChars = 3;

        setFilterDelay(delayOnManyChars: number, delayOnFewChars: number, howMuchIsFewChars: number) {

            this._delayOnManyChars = delayOnManyChars;
            this._delayOnFewChars = delayOnFewChars;
            this._howMuchIsFewChars = howMuchIsFewChars;
        }

        private maybeFilter() {

            const now = Date.now();

            const count = this.getFilterText().length;

            const delay = count <= this._howMuchIsFewChars ? this._delayOnFewChars : this._delayOnManyChars;

            if (now - this._filterTime > delay) {

                this._filterTime = now;

                this._token++;

                this.filterNow();

            } else {

                const token = this._token;

                requestAnimationFrame(() => {

                    if (token === this._token) {

                        this.maybeFilter();
                    }
                });
            }
        }

        private filterNow() {

            this.prepareFiltering(true);

            if (this.getFilterText().length > 0) {

                this.expandFilteredParents(this.getContentProvider().getRoots(this.getInput()));
            }

            this.repaint();
        }

        private expandFilteredParents(objects: any[]): void {

            const contentProvider = this.getContentProvider();

            for (const obj of objects) {

                if (this.isFilterIncluded(obj)) {

                    const children = contentProvider.getChildren(obj);

                    if (children.length > 0) {

                        this.setExpanded(obj, true);

                        this.expandFilteredParents(children);
                    }
                }
            }
        }

        protected buildFilterIncludeMap() {

            const provider = this.getContentProvider();

            const roots = provider ? provider.getRoots(this.getInput()) : [];

            this.buildFilterIncludeMap2(roots);
        }

        private buildFilterIncludeMap2(objects: any[]): boolean {

            let result = false;

            for (const obj of objects) {

                let resultThis = this.matches(obj);

                const children = this.getContentProvider().getChildren(obj);

                const resultChildren = this.buildFilterIncludeMap2(children);

                resultThis = resultThis || resultChildren;

                if (resultThis) {

                    this._filterIncludeSet.add(obj);

                    result = true;
                }
            }

            return result;
        }

        getContentProvider(): ITreeContentProvider {
            return super.getContentProvider() as ITreeContentProvider;
        }
    }
}