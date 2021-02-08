namespace phasereditor2d.animations.ui.editors {

    import controls = colibri.ui.controls;

    export class AnimationsEditorOutlineProvider extends colibri.ui.ide.EditorViewerProvider {

        private _editor: AnimationsEditor;

        constructor(editor: AnimationsEditor) {
            super();

            this._editor = editor;
            this._editor.eventSelectionChanged.addListener(sel => {

                this.setSelection(sel as any[], true, false);
            });
        }

        prepareViewerState(state: controls.viewers.ViewerState) {

            if (state.expandedObjects) {

                state.expandedObjects = new Set([...state.expandedObjects]

                    .map(o => this._editor.getAnimation(o.key))

                    .filter(o => o !== null && o !== undefined));
            }
        }

        onViewerSelectionChanged(sel: any[]) {

            this._editor.setSelection(sel, false);
        }

        getContentProvider(): controls.viewers.ITreeContentProvider {

            return new AnimationsEditorOutlineContentProvider();
        }

        getLabelProvider(): colibri.ui.controls.viewers.ILabelProvider {

            return new controls.viewers.LabelProvider(obj => {

                if (obj instanceof Phaser.Animations.Animation) {

                    return obj.key;

                } else if (obj instanceof Phaser.Animations.AnimationFrame) {

                    try {

                        const finder = this._editor.getScene().getMaker().getPackFinder();

                        const image = finder.getAssetPackItemImage(obj.textureKey, obj.textureFrame);

                        if (image.getPackItem() instanceof pack.core.ImageAssetPackItem
                            || obj.textureFrame === undefined
                            || obj.textureFrame === null) {

                            return obj.textureKey;
                        }
                    } catch (e) {
                        // nothing
                    }

                    return `${obj.textureFrame} (${obj.textureKey})`;
                }

                return "";
            });
        }

        getCellRendererProvider(): colibri.ui.controls.viewers.ICellRendererProvider {

            return new AnimationsEditorOutlineCellRendererProvider(this._editor);
        }

        getTreeViewerRenderer(viewer: colibri.ui.controls.viewers.TreeViewer): colibri.ui.controls.viewers.TreeViewerRenderer {

            const renderer = new controls.viewers.TreeViewerRenderer(viewer);

            return renderer;
        }

        getPropertySectionProvider(): colibri.ui.controls.properties.PropertySectionProvider {

            return this._editor.getPropertyProvider();
        }

        getInput() {

            return this._editor;
        }

        async preload(complete?: boolean): Promise<void> {

            // nothing
        }

        fillContextMenu(menu: controls.Menu) {

            this._editor.fillMenu(menu);
        }

        getUndoManager() {

            return this._editor.getUndoManager();
        }
    }
}