namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TextCellRenderer implements controls.viewers.ICellRenderer {

        constructor() {

        }

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const obj = args.obj as Text;

            const canvas = obj.canvas;

            controls.DefaultImage.paintImageElement(
                args.canvasContext, canvas, args.x, args.y, args.w, args.h, true);
        }

        cellHeight(args: controls.viewers.RenderCellArgs): number {

            return args.viewer.getCellSize();
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            return controls.PreloadResult.RESOURCES_LOADED;
        }
    }
}