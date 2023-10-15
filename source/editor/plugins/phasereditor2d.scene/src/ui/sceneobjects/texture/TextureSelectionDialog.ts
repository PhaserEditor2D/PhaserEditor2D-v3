namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    const grouping = pack.ui.viewers.AssetPackGrouping;

    const TYPES = [
        pack.core.IMAGE_TYPE,
        pack.core.SVG_TYPE,
        pack.core.ATLAS_TYPE,
        pack.core.SPRITESHEET_TYPE,
        pack.core.ASEPRITE_TYPE
    ];

    export class TextureSelectionDialog extends controls.dialogs.ViewerDialog {
        
        private _cancelButton: HTMLButtonElement;

        static createDialog(
            editor: editor.SceneEditor, selected: pack.core.AssetPackImageFrame[],
            callback: (selection: pack.core.AssetPackImageFrame[]) => void
        ) {

            const dlg = new TextureSelectionDialog(editor, callback);

            dlg.create();

            dlg.getViewer().setSelection(selected);
            dlg.getViewer().reveal(...selected);

            return dlg;
        }

        static async selectOneTexture(editor: editor.SceneEditor, selected?: pack.core.AssetPackImageFrame[], cancelButtonLabel?: string) {

            return new Promise((resolver, reject) => {

                const dlg = this.createDialog(editor, selected?? [], (selection) => {

                    resolver(selection[0]);
                });
                
                dlg.eventDialogClose.addListener(() => {
                    
                    resolver(undefined);
                });

                if (cancelButtonLabel) {

                    dlg.getCancelButton().innerHTML = cancelButtonLabel;
                }
            });
        }

        private _callback: (selection: pack.core.AssetPackImageFrame[]) => void;
        private _editor: editor.SceneEditor;

        private constructor(
            editor: ui.editor.SceneEditor,
            callback: (selection: pack.core.AssetPackImageFrame[]) => void
        ) {
            super(new controls.viewers.TreeViewer("phasereditor2d.scene.ui.sceneobjects.TextureSelectionDialog"), true);

            this._editor = editor;
            this._callback = callback;

            this.setSize(window.innerWidth / 2, window.innerHeight * 0.7, true);
        }

        create() {

            const viewer = this.getViewer();

            viewer.setLabelProvider(new pack.ui.viewers.AssetPackLabelProvider());
            viewer.setTreeRenderer(new pack.ui.viewers.AssetPackTreeViewerRenderer(viewer, false));


            viewer.setCellRendererProvider(new class extends pack.ui.viewers.AssetPackCellRendererProvider {

                getCellRenderer(element: any): controls.viewers.ICellRenderer {
                    
                    if (element instanceof pack.core.AnimationConfigInPackItem) {

                        return new pack.ui.viewers.AnimationConfigCellRenderer("square");
                    }

                    return super.getCellRenderer(element);
                }
            }("grid"));

            viewer.setContentProvider(new (class extends ui.blocks.SceneEditorBlocksContentProvider {

                getRoots(input: any) {

                    return input;
                }

                getChildren(parent: any): any[] {
                    
                    if (parent instanceof pack.core.AsepriteAssetPackItem) {

                        return parent.getFrames();
                    }

                    return super.getChildren(parent);
                }

            })(this._editor, () => this._editor.getPackFinder().getPacks()));

            viewer.setCellSize(64, true);
            viewer.setInput(TYPES);

            viewer.expandRoots();

            super.create();

            this.setTitle("Select Texture");

            const btn = this.addButton("Select", () => {

                this._callback(this.getViewer().getSelection());

                this.close();
            });

            btn.disabled = true;

            viewer.eventSelectionChanged.addListener(() => {

                btn.disabled = this.getViewer().getSelection().length !== 1
                    || !pack.core.AssetPackUtils.isImageFrameOrImage(this.getViewer().getSelectionFirstElement());
            });

            viewer.eventOpenItem.addListener(() => btn.click());

            this._cancelButton = this.addCancelButton();

            this.updateFromGroupingType();
        }

        getCancelButton() {

            return this._cancelButton;
        }

        private updateFromGroupingType() {

            const type = grouping.getGroupingPreference();

            const viewer = this.getViewer();

            switch (type) {

                case grouping.GROUP_ASSETS_BY_TYPE:

                    viewer.setInput(TYPES);
                    break;

                case grouping.GROUP_ASSETS_BY_PACK:

                    viewer.setInput(this._editor.getPackFinder().getPacks());
                    break;

                case grouping.GROUP_ASSETS_BY_LOCATION:

                    viewer.setInput(grouping.getAssetsFolders(this._editor.getPackFinder().getPacks()));
                    break;
            }

            viewer.repaint();
            viewer.expandRoots();
        }

        fillContextMenu(menu: controls.Menu) {

            const selectedType = grouping.getGroupingPreference();

            for (const type of grouping.GROUP_ASSET_TYPES) {

                menu.addAction({
                    text: "Group By " + grouping.GROUP_ASSET_TYPE_LABEL_MAP[type],
                    selected: type === selectedType,
                    callback: () => {

                        grouping.setGroupingPreference(type);
                        this.updateFromGroupingType();
                    }
                });
            }
        }
    }
}