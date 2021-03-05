namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export abstract class AbstractAssetPackClientBlocksProvider<T extends colibri.ui.ide.EditorPart> extends ide.EditorViewerProvider {

        private _editor: T;
        private _packs: pack.core.AssetPack[];

        constructor(editor: T) {
            super();

            this._editor = editor;

            this._packs = [];
        }

        abstract preloadAndGetFinder(complete?: boolean): Promise<pack.core.PackFinder>;

        getPacks() {

            return this._packs;
        }

        getEditor() {

            return this._editor;
        }

        async preload(complete?: boolean) {

            const finder = await this.preloadAndGetFinder(complete);

            this._packs = finder.getPacks();
        }

        prepareViewerState(state: controls.viewers.ViewerState) {

            if (state.expandedObjects) {

                state.expandedObjects = this.getFreshItems(state.expandedObjects);
            }

            if (state.selectedObjects) {

                state.selectedObjects = this.getFreshItems(state.selectedObjects);
            }
        }

        private getFreshItems(items: Set<any>): Set<any> {

            const set = new Set<any>();

            for (const obj of items) {

                if (obj instanceof pack.core.AssetPack) {

                    const pack = this._packs.find(p => p.getFile() === obj.getFile());

                    if (pack) {

                        set.add(pack);
                    }

                } else if (obj instanceof pack.core.AssetPackItem) {

                    const item = this.getFreshItem(obj);

                    if (item) {
                        set.add(item);
                    }

                } else if (obj instanceof pack.core.AssetPackImageFrame) {

                    const item = this.getFreshItem(obj.getPackItem());

                    if (item instanceof pack.core.ImageFrameContainerAssetPackItem) {

                        const frame = item.findFrame(obj.getName());

                        if (frame) {
                            set.add(frame);
                        }
                    }
                } else {

                    set.add(obj);
                }
            }

            return set;
        }

        private getFreshItem(item: pack.core.AssetPackItem) {

            const freshPack = this._packs.find(pack => pack.getFile() === item.getPack().getFile());

            const finder = new pack.core.PackFinder(freshPack);

            return finder.findAssetPackItem(item.getKey());
        }

        abstract getContentProvider();

        getLabelProvider(): controls.viewers.ILabelProvider {
            return new AssetPackLabelProvider();
        }

        getCellRendererProvider(): controls.viewers.ICellRendererProvider {

            return new AssetPackCellRendererProvider("grid");
        }

        abstract getTreeViewerRenderer(viewer: controls.viewers.TreeViewer);

        getUndoManager() {

            return this._editor.getUndoManager();
        }

        abstract getPropertySectionProvider();

        abstract getInput();
    }
}