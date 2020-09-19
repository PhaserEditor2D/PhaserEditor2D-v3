namespace colibri.ui.controls.viewers {

    export class FolderCellRenderer implements ICellRenderer {

        private _maxCount: number;

        constructor(maxCount: number = 8) {
            this._maxCount = maxCount;
        }

        renderCell(args: RenderCellArgs): void {

            if (this.cellHeight(args) === ROW_HEIGHT) {

                this.renderFolder(args);

            } else {

                this.renderGrid(args);
            }
        }

        private renderFolder(args: RenderCellArgs) {

            const icon = ide.Workbench.getWorkbench().getWorkbenchIcon(colibri.ICON_FOLDER);

            icon.paint(args.canvasContext, args.x, args.y, controls.RENDER_ICON_SIZE, controls.RENDER_ICON_SIZE, true);
        }

        async preload(args: PreloadCellArgs): Promise<PreloadResult> {

            const viewer = args.viewer;
            const obj = args.obj;

            let result = controls.PreloadResult.NOTHING_LOADED;

            const contentProvider = args.viewer.getContentProvider() as ITreeContentProvider;
            const children = contentProvider.getChildren(obj);

            for (const child of children) {

                const renderer = viewer.getCellRendererProvider().getCellRenderer(child);
                const args2 = args.clone();
                args2.obj = child;
                const result2 = await renderer.preload(args2);
                result = Math.max(result, result2);
            }

            return Promise.resolve(result);
        }

        protected renderGrid(args: RenderCellArgs) {

            const contentProvider = args.viewer.getContentProvider() as ITreeContentProvider;
            const children = contentProvider.getChildren(args.obj);

            const width = args.w;
            const height = args.h - 2;

            if (children) {

                const realCount = children.length;

                if (realCount === 0) {
                    return;
                }

                let frameCount = realCount;

                if (frameCount === 0) {
                    return;
                }

                let step = 1;

                if (frameCount > this._maxCount) {
                    step = frameCount / this._maxCount;
                    frameCount = this._maxCount;
                }

                if (frameCount === 0) {
                    frameCount = 1;
                }

                let size = Math.floor(Math.sqrt(width * height / frameCount) * 0.8) + 1;

                if (frameCount === 1) {
                    size = Math.min(width, height);
                }

                const cols = Math.floor(width / size);
                const rows = frameCount / cols + (frameCount % cols === 0 ? 0 : 1);
                const marginX = Math.floor(Math.max(0, (width - cols * size) / 2));
                const marginY = Math.floor(Math.max(0, (height - rows * size) / 2));

                let itemX = 0;
                let itemY = 0;

                const startX = args.x + marginX;
                const startY = 2 + args.y + marginY;

                for (let i = 0; i < frameCount; i++) {

                    if (itemY + size > height) {
                        break;
                    }

                    const index = Math.min(realCount - 1, Math.round(i * step));

                    const obj = children[index];

                    const renderer = args.viewer.getCellRendererProvider().getCellRenderer(obj);

                    const args2 = new RenderCellArgs(args.canvasContext,
                        startX + itemX, startY + itemY,
                        size, size,
                        obj, args.viewer, true
                    );

                    renderer.renderCell(args2);

                    itemX += size;

                    if (itemX + size > width) {
                        itemY += size;
                        itemX = 0;
                    }
                }

            }
        }

        cellHeight(args: RenderCellArgs): number {
            return args.viewer.getCellSize() < 50 ? ROW_HEIGHT : args.viewer.getCellSize();
        }
    }
}