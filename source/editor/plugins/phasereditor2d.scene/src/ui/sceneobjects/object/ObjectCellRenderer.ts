namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ObjectCellRenderer implements controls.viewers.ICellRenderer {

        private _maxWidth: number;
        private _maxHeight: number;

        constructor(maxWidth = 1024, maxHeight = 1024) {

            this._maxWidth = maxWidth;
            this._maxHeight = maxHeight;
        }

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const obj = args.obj as Image;

            const cached = obj.getData("__renderer_image") as controls.IImage;

            if (cached) {

                cached.paint(args.canvasContext, args.x, args.y, args.w, args.h, false);
            }
        }

        cellHeight(args: controls.viewers.RenderCellArgs): number {

            return args.viewer.getCellSize();
        }

        preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            const obj = args.obj as Image;

            const support = obj.getEditorSupport();

            const hash = support.computeContentHash();

            if (obj.getData("__last_render_hash") === hash) {

                return controls.Controls.resolveNothingLoaded();
            }

            obj.setData("__last_render_hash", hash);

            const currentPromise = obj.data.get("__renderer_promise") as Promise<controls.PreloadResult>;

            if (currentPromise) {

                return currentPromise;
            }

            const promise = new Promise<controls.PreloadResult>((resolve, reject) => {

                const angle = obj.angle;
                const originX = obj.originX;
                const originY = obj.originY;
                const scaleX = obj.scaleX;
                const scaleY = obj.scaleY;

                obj.setAngle(0);
                obj.setOrigin(0, 0);
                obj.setScale(1, 1);

                let renderX = 0;
                let renderY = 0;
                let renderWidth = obj.width;
                let renderHeight = obj.height;

                if (obj instanceof sceneobjects.TilemapLayer) {

                    const layer = obj as sceneobjects.TilemapLayer;

                    if (layer.getEditorSupport().getOrientation() === Phaser.Tilemaps.Orientation.ISOMETRIC) {

                        renderX = layer.width / 2;
                        renderY = -layer.height / 2;
                        renderWidth = layer.width * 2;
                        renderHeight = layer.height * 2;
                    }
                }

                renderWidth = Math.min(this._maxWidth, renderWidth);
                renderHeight = Math.min(this._maxWidth, renderHeight);

                const render = new Phaser.GameObjects.RenderTexture(
                    support.getScene(), 0, 0, renderWidth, renderHeight);

                render.draw(obj, renderX, renderY);

                render.snapshot(imgElement => {

                    const img = new controls.ImageWrapper(imgElement as HTMLImageElement);

                    obj.setData("__renderer_image", img);
                    obj.setData("__renderer_promise", null);

                    resolve(controls.PreloadResult.RESOURCES_LOADED);
                });

                obj.setAngle(angle);
                obj.setOrigin(originX, originY);
                obj.setScale(scaleX, scaleY);

                render.destroy();
            });

            obj.setData("__renderer_promise", promise);

            return promise;
        }
    }
}