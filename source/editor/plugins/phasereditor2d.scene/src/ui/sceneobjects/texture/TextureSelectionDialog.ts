namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TextureSelectionDialog extends controls.dialogs.ViewerDialog {

        private _finder: pack.core.PackFinder;

        static async createDialog(
            finder: pack.core.PackFinder, selected: pack.core.AssetPackImageFrame[],
            callback: (selection: pack.core.AssetPackImageFrame[]) => void
        ) {

            const dlg = new TextureSelectionDialog(finder, callback);

            dlg.create();

            dlg.getViewer().setSelection(selected);
            dlg.getViewer().reveal(...selected);

            return dlg;
        }

        private _callback: (selection: pack.core.AssetPackImageFrame[]) => void;

        private constructor(
            finder: pack.core.PackFinder,
            callback: (selection: pack.core.AssetPackImageFrame[]) => void
        ) {
            super(new controls.viewers.TreeViewer("phasereditor2d.scene.ui.sceneobjects.TextureSelectionDialog"), true);

            this._finder = finder;
            this._callback = callback;

            const size = this.getSize();
            this.setSize(size.width, size.height * 1.5);
        }

        create() {

            const viewer = this.getViewer();

            viewer.setLabelProvider(new pack.ui.viewers.AssetPackLabelProvider());
            viewer.setTreeRenderer(new controls.viewers.ShadowGridTreeViewerRenderer(viewer, false, true));
            viewer.setCellRendererProvider(new pack.ui.viewers.AssetPackCellRendererProvider("grid"));
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setCellSize(64 * controls.DEVICE_PIXEL_RATIO, true);
            viewer.setInput(
                this._finder.getPacks()
                    .flatMap(pack => pack.getItems())
                    .filter(item => item instanceof pack.core.ImageFrameContainerAssetPackItem)
                    .flatMap(item => {

                        const frames = (item as pack.core.ImageFrameContainerAssetPackItem).getFrames();

                        if (item instanceof pack.core.SpritesheetAssetPackItem) {

                            if (frames.length > 50) {
                                return frames.slice(0, 50);
                            }
                        }

                        return frames;
                    })
            );

            super.create();

            this.setTitle("Select Texture");

            const btn = this.addButton("Select", () => {

                this._callback(this.getViewer().getSelection());

                this.close();
            });

            btn.disabled = true;

            this.getViewer().eventSelectionChanged.addListener(() => {

                btn.disabled = this.getViewer().getSelection().length === 0;
            });

            this.addButton("Cancel", () => this.close());
        }
    }
}