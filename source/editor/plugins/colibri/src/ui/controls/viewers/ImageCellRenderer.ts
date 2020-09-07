namespace colibri.ui.controls.viewers {

    export class ImageCellRenderer implements ICellRenderer {

        private _singleImage: IImage;

        constructor(singleImage?: IImage) {

            this._singleImage = singleImage;
        }

        getImage(obj: any): IImage {

            if (this._singleImage) {

                return this._singleImage;
            }

            return obj;
        }

        renderCell(args: RenderCellArgs): void {

            const img = this.getImage(args.obj);

            if (!img) {

                DefaultImage.paintEmpty(args.canvasContext, args.x, args.y, args.w, args.h);

            } else {

                img.paint(args.canvasContext, args.x, args.y, args.w, args.h, args.center);
            }
        }

        cellHeight(args: RenderCellArgs): number {
            return args.viewer.getCellSize();
        }

        preload(args: PreloadCellArgs): Promise<PreloadResult> {

            const img = this.getImage(args.obj);

            if (img) {
                return img.preload();
            }

            return Controls.resolveNothingLoaded();
        }
    }
}