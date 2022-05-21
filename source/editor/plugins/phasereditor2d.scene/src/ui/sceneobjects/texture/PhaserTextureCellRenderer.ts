namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class PhaserTextureCellRenderer implements controls.viewers.ICellRenderer {

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const image = this.getImage(args);

            if (image) {

                image.paint(args.canvasContext, args.x, args.y, args.w, args.h, false);

            } else {

                controls.DefaultImage.paintEmpty(args.canvasContext, args.x, args.y, args.w, args.h);
            }
        }

        private getImage(args: { obj: any }) {

            const obj = args.obj as Sprite;

            const texture = obj.scene.textures.get(obj.texture.key);

            if (texture) {

                const canvas = texture.getSourceImage() as HTMLCanvasElement;

                return new controls.ImageWrapper(canvas);
            }

            return null;
        }

        cellHeight(args: colibri.ui.controls.viewers.RenderCellArgs): number {

            return args.viewer.getCellSize();
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            const image = this.getImage(args);

            if (image) {

                return image.preload();
            }

            return controls.PreloadResult.NOTHING_LOADED;
        }
    }
}