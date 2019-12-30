namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ImageObjectCellRenderer implements controls.viewers.ICellRenderer {

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const sprite = args.obj as Phaser.GameObjects.GameObject;

            if (sprite instanceof sceneobjects.Image) {

                const { key, frame } = sprite.getEditorSupport().getTextureSupport().getTexture();

                const image = pack.core.parsers.ImageFrameParser
                    .getSourceImageFrame(sprite.getEditorSupport().getScene().game, key, frame);

                if (image) {

                    image.paint(args.canvasContext, args.x, args.y, args.w, args.h, false);
                }
            }
        }

        cellHeight(args: colibri.ui.controls.viewers.RenderCellArgs): number {

            return args.viewer.getCellSize();
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<colibri.ui.controls.PreloadResult> {

            const finder = new pack.core.PackFinder();

            return finder.preload();
        }
    }
}