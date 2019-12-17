namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;

    export class GameObjectCellRenderer implements controls.viewers.ICellRenderer {

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const sprite = <Phaser.GameObjects.GameObject>args.obj;

            if (sprite instanceof gameobjects.EditorImage) {

                const { key, frame } = sprite.getEditorTexture();

                const image = pack.core.parsers.ImageFrameParser.getSourceImageFrame(sprite.getEditorScene().game, key, frame);

                if (image) {

                    image.paint(args.canvasContext, args.x, args.y, args.w, args.h, false);
                }
            }
        }

        cellHeight(args: colibri.ui.controls.viewers.RenderCellArgs): number {

            if (args.obj instanceof gameobjects.EditorImage) {
                return args.viewer.getCellSize();
            }

            return colibri.ui.controls.ROW_HEIGHT;
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<colibri.ui.controls.PreloadResult> {

            const finder = new pack.core.PackFinder();

            return finder.preload();
        }
    }
}