namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    const grouping = pack.ui.viewers.AssetPackGrouping;

    const TYPES = [
        pack.core.IMAGE_TYPE,
        pack.core.SVG_TYPE,
        pack.core.ATLAS_TYPE,
        pack.core.SPRITESHEET_TYPE
    ];

    export class TextureSelectionDialog extends controls.dialogs.ViewerDialog {

        static async createDialog(
            editor: editor.SceneEditor, selected: pack.core.AssetPackImageFrame[],
            callback: (selection: pack.core.AssetPackImageFrame[]) => void
        ) {

            const dlg = new TextureSelectionDialog(editor, callback);

            dlg.create();

            dlg.getViewer().setSelection(selected);
            dlg.getViewer().reveal(...selected);

            return dlg;
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

            this.setSize(window.innerWidth * 2 / 3, window.innerHeight * 2 / 3);
        }

        create() {

            const viewer = this.getViewer();

            viewer.setLabelProvider(new pack.ui.viewers.AssetPackLabelProvider());
            viewer.setTreeRenderer(new pack.ui.viewers.AssetPackTreeViewerRenderer(viewer, false));

            viewer.setCellRendererProvider(new pack.ui.viewers.AssetPackCellRendererProvider("grid"));

            viewer.setContentProvider(new (class extends ui.blocks.SceneEditorBlocksContentProvider {

                getRoots(input: any) {

                    return input;
                }
            })(this._editor, () => this._editor.getPackFinder().getPacks()));

            viewer.setCellSize(64 * controls.DEVICE_PIXEL_RATIO, true);
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

            this.addButton("Cancel", () => this.close());

            this.updateFromGroupingType();
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