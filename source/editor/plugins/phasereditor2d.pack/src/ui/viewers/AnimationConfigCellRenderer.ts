namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;

    export class AnimationConfigCellRenderer implements controls.viewers.ICellRenderer {

        private _finder: pack.core.PackFinder;
        public layout: "square" | "full-width" = "full-width";

        constructor(finder: pack.core.PackFinder) {

            this._finder = finder;
        }

        getAnimationConfig(args: controls.viewers.RenderCellArgs | controls.viewers.PreloadCellArgs): pack.core.AnimationConfigInPackItem {

            return args.obj;
        }

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const anim = this.getAnimationConfig(args);

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

            const anim = this.getAnimationConfig(args);

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
}