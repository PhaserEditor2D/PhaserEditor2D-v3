namespace phasereditor2d.scene.ui.viewers {

    import controls = colibri.ui.controls;
    import core = colibri.core;

    export class SceneFileCellRenderer implements controls.viewers.ICellRenderer {

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const file = <core.io.FilePath>args.obj;

            const image = SceneThumbnailCache.getInstance().getContent(file);
            
            if (image) {
                image.paint(args.canvasContext, args.x, args.y, args.w, args.h, args.center);
            }
        }

        cellHeight(args: controls.viewers.RenderCellArgs): number {
            return args.viewer.getCellSize();
        }


        async preload(args : controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            const file = <core.io.FilePath>args.obj;

            return SceneThumbnailCache.getInstance().preload(file);
        }
    }

}