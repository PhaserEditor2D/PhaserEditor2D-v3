namespace phasereditor2d.scene.ui.blocks {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export class SceneEditorBlocksProvider extends ide.EditorViewerProvider {

        private _editor: editor.SceneEditor;
        private _packs: pack.core.AssetPack[];

        constructor(editor: editor.SceneEditor) {
            super();

            this._editor = editor;
            this._packs = [];
        }

        async preload() {

            const finder = new pack.core.PackFinder();

            await finder.preload();

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

                if (obj instanceof pack.core.AssetPackItem) {

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

        getContentProvider(): controls.viewers.ITreeContentProvider {
            return new SceneEditorBlocksContentProvider(() => this._packs);
        }

        getLabelProvider(): controls.viewers.ILabelProvider {
            return new SceneEditorBlocksLabelProvider();
        }

        getCellRendererProvider(): controls.viewers.ICellRendererProvider {
            return new SceneEditorBlocksCellRendererProvider();
        }

        getTreeViewerRenderer(viewer: controls.viewers.TreeViewer) {
            return new SceneEditorBlocksTreeRendererProvider(viewer);
        }

        getUndoManager() {
            return this._editor;
        }

        getPropertySectionProvider(): controls.properties.PropertySectionProvider {
            return new SceneEditorBlocksPropertyProvider();
        }

        getInput() {
            return this;
        }
    }
}