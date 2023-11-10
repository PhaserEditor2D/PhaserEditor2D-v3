/// <reference path="./StringPropertyType.ts" />
/// <reference path="./AbstractDialogPropertyType.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export abstract class AbstractAssetKeyPropertyType extends AbstractDialogPropertyType {

        protected async updateIcon(iconControl: controls.IconControl, value: any) {

            const finder = new pack.core.PackFinder();

            await finder.preload();

            const icon = this.getIcon(finder, value);

            if (icon) {

                iconControl.setIcon(icon);
            }
        }

        protected getIcon(finder: pack.core.PackFinder, value: string): controls.IImage {

            return null;
        }

        protected async createViewer() {

            const finder = new pack.core.PackFinder();

            await finder.preload();

            const viewer = new controls.viewers.TreeViewer(
                "phasereditor2d.scene.ui.sceneobjects.SelectAssetDialog." + this.getId());

            viewer.setCellRendererProvider(new CellRendererProvider(finder, "tree"));
            viewer.setLabelProvider(new pack.ui.viewers.AssetPackLabelProvider());
            viewer.setTreeRenderer(new controls.viewers.TreeViewerRenderer(viewer));
            viewer.setContentProvider(new AssetKeyContentProvider());

            return viewer;
        }

        protected async loadViewerInput(viewer: controls.viewers.TreeViewer) {

            const finder = new pack.core.PackFinder();

            await finder.preload();

            viewer.setInput(finder.getPacks());

            for (const pack of finder.getPacks()) {

                viewer.setExpanded(pack, true);
            }
        }

        protected valueToString(viewer: controls.viewers.TreeViewer, selected: any): string {

            if (selected instanceof pack.core.AssetPackImageFrame) {

                return this.formatKeyFrame(selected.getPackItem().getKey(), selected.getName());

            }

            const key = viewer.getLabelProvider().getLabel(selected);

            return this.formatKeyFrame(key);
        }

        protected formatKeyFrame(key: string, frame?: string | number) {

            if (frame === undefined || frame === null) {

                return key;
            }

            return frame.toString();
        }
    }

    class CellRendererProvider extends pack.ui.viewers.AssetPackCellRendererProvider {

        private _finder: pack.core.PackFinder;

        constructor(finder: pack.core.PackFinder, layout: "tree" | "grid") {
            super(layout);

            this._finder = finder;
        }

        getCellRenderer(element: any) {

            if (element instanceof pack.core.AnimationConfigInPackItem) {

                return new pack.ui.viewers.AnimationConfigCellRenderer();
            }

            return super.getCellRenderer(element);
        }
    }

    class AssetKeyContentProvider implements controls.viewers.ITreeContentProvider {

        getRoots(input: any): any[] {

            return input;
        }

        getChildren(parent: any): any[] {

            if (parent instanceof pack.core.AssetPack) {

                return parent.getItems();
            }

            if (parent instanceof pack.core.ImageAssetPackItem) {

                return [];
            }

            if (parent instanceof pack.core.ImageFrameContainerAssetPackItem) {

                return parent.getFrames();
            }

            if (parent instanceof pack.core.BaseAnimationsAssetPackItem) {

                return parent.getAnimations();
            }

            return [];
        }
    }
}