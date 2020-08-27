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

                    if (obj.textureFrame === undefined || obj.textureFrame === null) {

                        return obj.textureKey;
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

            return new controls.viewers.TreeViewerRenderer(viewer);
        }

        getPropertySectionProvider(): colibri.ui.controls.properties.PropertySectionProvider {

            return null;
        }

        getInput() {

            return this._editor;
        }

        async preload(complete?: boolean): Promise<void> {

            // nothing
        }

        getUndoManager() {

            return this._editor.getUndoManager();
        }
    }
}