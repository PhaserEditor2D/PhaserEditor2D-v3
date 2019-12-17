/// <reference path="./Viewer.ts"/>
/// <reference path="./EmptyTreeContentProvider.ts" />

namespace colibri.ui.controls.viewers {

    export const TREE_ICON_SIZE = ICON_SIZE;
    export const LABEL_MARGIN = TREE_ICON_SIZE + 0;


    export declare type TreeIconInfo = {
        rect: Rect,
        obj: any
    }

    export class TreeViewer extends Viewer {

        private _treeRenderer: TreeViewerRenderer;
        private _treeIconList: TreeIconInfo[];

        constructor(...classList: string[]) {
            super("TreeViewer", ...classList);

            this.getCanvas().addEventListener("click", e => this.onClick(e));

            this._treeRenderer = new TreeViewerRenderer(this);

            this._treeIconList = [];

            this.setContentProvider(new controls.viewers.EmptyTreeContentProvider());
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

        reveal(...objects: any[]): void {

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

            const scrollPane = <ScrollPane>this.getContainer().getContainer();

            this.repaint().then(() => {

                const objSet = new Set(objects);

                let found = false;

                let y = -this._contentHeight;

                const b = this.getBounds();

                for (const item of this._paintItems) {

                    if (objSet.has(item.data)) {

                        if (item.y < 0 || item.y + item.h > b.height) {

                            y = (item.y - b.height / 2 + item.h / 2) - this.getScrollY();

                            found = true;

                            break;
                        }
                    }
                }

                if (found) {

                    this.setScrollY(-y);
                    this.repaint();

                    scrollPane.layout();
                }
            });

        }


        private revealPath(path: any[]) {

            for (let i = 0; i < path.length - 1; i++) {
                this.setExpanded(path[i], true);
            }
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

                const found = this.getObjectPath2(obj, path, contentProvider.getChildren(child));

                if (found) {
                    return true;
                }

                path.pop();
            }

            return false;
        }

        private getTreeIconAtPoint(e: MouseEvent) {

            for (let icon of this._treeIconList) {
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

        visitObjects(visitor: Function) {
            const provider = this.getContentProvider();
            const list = provider ? provider.getRoots(this.getInput()) : [];
            this.visitObjects2(list, visitor);
        }

        private visitObjects2(objects: any[], visitor: Function) {
            for (var obj of objects) {
                visitor(obj);
                if (this.isExpanded(obj) || this.getFilterText() !== "") {
                    const list = this.getContentProvider().getChildren(obj);
                    this.visitObjects2(list, visitor);
                }
            }
        }

        async preload(): Promise<PreloadResult> {

            const list: Promise<PreloadResult>[] = [];
            
            const viewer = this;

            this.visitObjects(obj => {

                const provider = this.getCellRendererProvider();

                list.push(provider.preload(obj).then(r1 => {

                    const renderer = provider.getCellRenderer(obj);

                    return renderer.preload(new PreloadCellArgs(obj, viewer)).then(r2 => {
                        return Math.max(r1, r2);
                    });
                }));
            });

            return Controls.resolveAll(list);
        }


        protected paint(): void {
            
            const result = this._treeRenderer.paint();

            this._contentHeight = result.contentHeight;
            this._paintItems = result.paintItems;
            this._treeIconList = result.treeIconList;
        }

        setFilterText(filter: string) {

            super.setFilterText(filter);

            if (filter !== "") {
                this.expandFilteredParents(this.getContentProvider().getRoots(this.getInput()));
                this.repaint();
            }
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

        buildFilterIncludeMap() {

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
            return <ITreeContentProvider>super.getContentProvider();
        }

        expandCollapseBranch(obj: any) {

            if (this.getContentProvider().getChildren(obj).length > 0) {

                this.setExpanded(obj, !this.isExpanded(obj));

                return [obj];
            }

            return super.expandCollapseBranch(obj);
        }

    }
}