namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TextureSelectionDialog extends controls.dialogs.ViewerDialog {

        private _finder: pack.core.PackFinder;

        static async createDialog(
            finder: pack.core.PackFinder, selected: pack.core.AssetPackImageFrame[],
            callback: (selection: pack.core.AssetPackImageFrame[]) => void,
            atlasKey?: string
        ) {

            const dlg = new TextureSelectionDialog(finder, callback, atlasKey);

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
            atlasKey?: string
        ) {
            super(new controls.viewers.TreeViewer("phasereditor2d.scene.ui.sceneobjects.TextureSelectionDialog"), true);

            this._finder = finder;
            this._callback = callback;
            this._atlasKey = atlasKey;

            this.setSize(window.innerWidth * 2 / 3, window.innerHeight * 2 / 3);
        }

        create() {

            const viewer = this.getViewer();

            viewer.setLabelProvider(new pack.ui.viewers.AssetPackLabelProvider());
            viewer.setTreeRenderer(new pack.ui.viewers.AssetPackTreeViewerRenderer(viewer, false));
            viewer.setCellRendererProvider(new pack.ui.viewers.AssetPackCellRendererProvider("grid"));
            viewer.setContentProvider(new TextureContentProvider(this._finder));
            viewer.setCellSize(64 * controls.DEVICE_PIXEL_RATIO, true);

            let input: any;

            if (this._atlasKey) {

                const item = this._finder.findAssetPackItem(this._atlasKey);

                if (item instanceof pack.core.ImageFrameContainerAssetPackItem) {

                    input = item.getFrames();

                } else {

                    input = [];
                }

            } else {

                input = [
                    pack.core.IMAGE_TYPE,
                    pack.core.SVG_TYPE,
                    pack.core.ATLAS_TYPE,
                    pack.core.SPRITESHEET_TYPE
                ];
            }

            viewer.setInput(input);

            viewer.expandRoots();

            super.create();

            this.setTitle("Select Texture");

            const btn = this.addButton("Select", () => {

                this._callback(this.getViewer().getSelection());

                this.close();
            });

            btn.disabled = true;

            this.getViewer().eventSelectionChanged.addListener(() => {

                btn.disabled = this.getViewer().getSelection().length !== 1
                    || !pack.core.AssetPackUtils.isImageFrameOrImage(this.getViewer().getSelectionFirstElement());
            });

            this.addButton("Cancel", () => this.close());
        }
    }

    class TextureContentProvider extends pack.ui.viewers.AssetPackContentProvider {

        private _finder: pack.core.PackFinder;

        constructor(finder: pack.core.PackFinder) {
            super();

            this._finder = finder;
        }

        getRoots(input: any): any[] {

            // the sections
            return input;
        }

        getPackItems() {

            return this._finder.getPacks().flatMap(p => p.getItems());
        }

        getChildren(parent: any) {

            switch (parent) {

                case pack.core.ATLAS_TYPE:

                    return this.getPackItems().filter(i => pack.core.AssetPackUtils.isAtlasType(i.getType()));

                case pack.core.IMAGE_TYPE:
                case pack.core.SVG_TYPE:
                case pack.core.SPRITESHEET_TYPE:

                    return this.getPackItems().filter(i => i.getType() === parent);
            }

            return super.getChildren(parent);
        }
    }
}