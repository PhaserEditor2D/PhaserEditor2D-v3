namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TextureFrameSelectionDialog extends controls.dialogs.ViewerDialog {

        private _finder: pack.core.PackFinder;

        static async createDialog(
            finder: pack.core.PackFinder, selected: pack.core.AssetPackImageFrame[],
            callback: (selection: pack.core.AssetPackImageFrame[]) => void,
            atlasKey: string
        ) {

            const dlg = new TextureFrameSelectionDialog(finder, callback, atlasKey);

            dlg.create();

            dlg.getViewer().setSelection(selected);
            dlg.getViewer().reveal(...selected);

            return dlg;
        }

        private _callback: (selection: pack.core.AssetPackImageFrame[]) => void;
        private _atlasKey: string;

        private constructor(
            finder: pack.core.PackFinder,
            callback: (selection: pack.core.AssetPackImageFrame[]) => void,
            atlasKey: string
        ) {
            super(new controls.viewers.TreeViewer("phasereditor2d.scene.ui.sceneobjects.TextureFrameSelectionDialog"), true);

            this._finder = finder;
            this._callback = callback;
            this._atlasKey = atlasKey;

            this.setSize(900, 500, true);
        }

        create() {

            const viewer = this.getViewer();

            viewer.setLabelProvider(new pack.ui.viewers.AssetPackLabelProvider());
            viewer.setTreeRenderer(new pack.ui.viewers.AssetPackTreeViewerRenderer(viewer, false));
            viewer.setCellRendererProvider(new pack.ui.viewers.AssetPackCellRendererProvider("grid"));
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setCellSize(64, true);

            let input: any;


            const item = this._finder.findAssetPackItem(this._atlasKey);

            if (item instanceof pack.core.ImageFrameContainerAssetPackItem) {

                input = item.getFrames();

            } else {

                input = [];
            }

            viewer.setInput(input);

            viewer.expandRoots();

            super.create();

            this.setTitle("Select Texture Frame");

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
        }
    }
}