namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineSkinCellRenderer implements controls.viewers.ICellRenderer {

        protected getSkinItem(args: controls.viewers.RenderCellArgs | controls.viewers.PreloadCellArgs)
            : pack.core.SpineSkinItem {

            return args.obj;
        }

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const skin = this.getSkinItem(args);

            const cache = ScenePlugin.getInstance().getSpineThumbnailCache();

            const image = cache.getContent(skin);

            if (image) {

                image.paint(args.canvasContext, args.x, args.y, args.w, args.h, args.center);
            }
        }

        cellHeight(args: controls.viewers.RenderCellArgs): number {

            return args.viewer.getCellSize();
        }

        preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            const skin = this.getSkinItem(args);

            const cache = ScenePlugin.getInstance().getSpineThumbnailCache();

            return cache.preload(skin);
        }
    }
}