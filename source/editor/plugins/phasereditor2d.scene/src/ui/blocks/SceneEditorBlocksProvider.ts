namespace phasereditor2d.scene.ui.blocks {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export const TAB_SECTION_BUILT_IN = "Built-In";
    export const TAB_SECTION_PREFABS = "Prefabs";
    export const TAB_SECTION_ASSETS = "Assets";
    export const TAB_SECTIONS = [
        TAB_SECTION_BUILT_IN,
        TAB_SECTION_PREFABS,
        TAB_SECTION_ASSETS,
    ]

    export class SceneEditorBlocksProvider extends ide.EditorViewerProvider {

        private _editor: editor.SceneEditor;
        private _packs: pack.core.AssetPack[];

        constructor(editor: editor.SceneEditor) {
            super();

            this._editor = editor;
            this._packs = [];
        }

        getEditor() {

            return this._editor;
        }

        allowsTabSections() {

            return true;
        }

        getTabSections() {

            return TAB_SECTIONS;
        }

        fillContextMenu(menu: controls.Menu) {

            pack.ui.viewers.AssetPackGrouping.fillMenu(menu, () => this.repaint(true));
        }

        async preload(complete?: boolean) {

            let finder: pack.core.PackFinder;

            if (this._editor.getScene() && !complete) {

                finder = this._editor.getSceneMaker().getPackFinder();

            } else {

                finder = new pack.core.PackFinder();

                await finder.preload();
            }

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
                } else if (obj instanceof pack.core.SpineSkinItem) {

                    const item  = this.getFreshItem(obj.spineAsset);

                    if (item && item instanceof pack.core.SpineAssetPackItem) {

                        const skins = item.getGuessSkinItems();

                        const newName = skins.find(n => n.skinName === obj.skinName);

                        if (newName) {

                            set.add(newName);
                        }
                    }

                } else if (obj instanceof pack.core.AnimationConfigInPackItem) {

                    const item = this.getFreshItem(obj.getParent()) as pack.core.BaseAnimationsAssetPackItem;

                    if (item) {

                        const found = item.getAnimations().find(a => a.getKey() === obj.getKey());

                        if (found) {

                            set.add(found);
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

            return new SceneEditorBlocksContentProvider(this._editor, () => this._packs);
        }

        getLabelProvider(): controls.viewers.ILabelProvider {

            return new SceneEditorBlocksLabelProvider();
        }

        getStyledLabelProvider(): controls.viewers.IStyledLabelProvider {
            
            return new SceneEditorBlocksStyledLabelProvider(this._editor);
        }

        getCellRendererProvider(): controls.viewers.ICellRendererProvider {

            return new SceneEditorBlocksCellRendererProvider();
        }

        getTreeViewerRenderer(viewer: controls.viewers.TreeViewer) {
            // TODO: we should implements the Favorites section
            return new SceneEditorBlocksTreeRendererProvider(this, viewer);
        }

        getUndoManager() {

            return this._editor.getUndoManager();
        }

        getPropertySectionProvider(): controls.properties.PropertySectionProvider {

            return new SceneEditorBlocksPropertyProvider();
        }

        getInput() {

            return this;
        }
    }
}