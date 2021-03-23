namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;

    export class BitmapFontAssetCellRenderer implements controls.viewers.ICellRenderer {

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const img = this.getImage(args.obj);

            if (img) {

                const item = args.obj as pack.core.BitmapFontAssetPackItem;

                const data = item.getFontData();

                let renderImage = true;

                if (data && data.chars.size > 0) {

                    renderImage = renderBitmapFontChar(args, "aAbBfF1", data, img);
                }

                if (renderImage) {

                    img.paint(args.canvasContext, args.x, args.y, args.w, args.h, false);
                }
            }
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            const item = args.obj as pack.core.BitmapFontAssetPackItem;

            const result1 = await item.preload();

            const img = this.getImage(args.obj);

            if (img) {

                const result2 = await img.preload();

                return Math.max(result1, result2);
            }

            return controls.Controls.resolveNothingLoaded();
        }

        private getImage(item: core.BitmapFontAssetPackItem) {

            const url = item.getData().textureURL;

            const img = core.AssetPackUtils.getImageFromPackUrl(item.getPack(), url);

            return img;
        }

        cellHeight(args: controls.viewers.RenderCellArgs): number {

            return args.viewer.getCellSize();
        }
    }

    function renderBitmapFontChar(args: controls.viewers.RenderCellArgs,
        chars: string, fontData: core.IBitmapFontData, img: controls.IImage) {

        for (let i = 0; i < chars.length; i++) {

            const charCode = chars.charCodeAt(i);

            const charData = fontData.chars.get(charCode);

            if (charData) {

                const { x, y, width, height } = charData;

                img.paintFrame(args.canvasContext, x, y, width, height, args.x, args.y, args.w, args.h);

                return false;
            }
        }

        return true;
    };
}