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

                return new AnimationCellRenderer(this._finder);
            }

            return super.getCellRenderer(element);
        }
    }

    class AnimationCellRenderer implements controls.viewers.ICellRenderer {

        private _finder: pack.core.PackFinder;
        public layout: "square" | "full-width" = "full-width";

        constructor(finder: pack.core.PackFinder) {

            this._finder = finder;
        }

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const anim = args.obj as pack.core.AnimationConfigInPackItem;

            const frames = anim.getFrames();

            if (frames.length === 0) {

                return;
            }

            const cellSize = args.viewer.getCellSize();

            const len = frames.length;

            const indexes = [0, Math.floor(len / 2), len - 1];

            const ctx = args.canvasContext;

            ctx.save();

            if (cellSize <= controls.ROW_HEIGHT) {

                const img = this.getImage(frames[0]);

                if (img) {

                    img.paint(ctx, args.x, args.y, args.w, args.h, true);
                }

            } else {

                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < indexes.length; i++) {

                    const frame = frames[indexes[i]];

                    const img = this.getImage(frame);

                    if (img) {

                        const x = Math.floor(args.x + i * cellSize * 0.8);

                        img.paint(ctx, x, args.y + 2, cellSize, args.h - 4, true);
                    }
                }
            }

            ctx.restore();
        }

        private getImage(frame: pack.core.AnimationFrameConfigInPackItem) {

            const image = this._finder.getAssetPackItemImage(frame.getTextureKey(), frame.getFrameKey());

            return image;
        }

        cellHeight(args: controls.viewers.RenderCellArgs): number {

            return args.viewer.getCellSize();
        }

        async preload(args: controls.viewers.PreloadCellArgs) {

            let result = controls.PreloadResult.NOTHING_LOADED;

            const anim = args.obj as pack.core.AnimationConfigInPackItem;

            for (const frame of anim.getFrames()) {

                const obj = this._finder.getAssetPackItemOrFrame(frame.getTextureKey(), frame.getFrameKey());

                if (obj) {

                    const objResult = await obj.preload();

                    result = Math.max(result, objResult);
                }
            }

            return result;
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

            if (parent instanceof pack.core.AnimationsAssetPackItem) {

                return parent.getAnimations();
            }

            return [];
        }
    }
}