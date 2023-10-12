namespace phasereditor2d.animations.ui.editors {

    import controls = colibri.ui.controls;

    export class EditorAnimationCellRenderer implements controls.viewers.ICellRenderer {

        private _editor: AnimationsEditor;

        constructor(editor: AnimationsEditor) {

            this._editor = editor;
        }

        get layout(): "full-width" {

            return "full-width";
        }

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const anim = args.obj as Phaser.Animations.Animation;

            const frames = anim.frames;

            if (frames.length === 0) {

                return;
            }

            const cellSize = args.viewer.getCellSize();

            const len = frames.length;

            const indexes = [0, Math.floor(len / 2), len - 1];

            const ctx = args.canvasContext;

            ctx.save();

            if (cellSize <= controls.ROW_HEIGHT * 2) {

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

        private getImage(frame: Phaser.Animations.AnimationFrame) {

            return this._editor.getScene().getMaker().getPackFinder()
                .getAssetPackItemImage(frame.textureKey, frame.textureFrame);
        }

        cellHeight(args: controls.viewers.RenderCellArgs): number {

            return args.viewer.getCellSize();
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            return controls.PreloadResult.NOTHING_LOADED;
        }
    }
}