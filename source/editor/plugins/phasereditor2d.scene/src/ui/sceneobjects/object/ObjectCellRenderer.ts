namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ObjectCellRenderer implements controls.viewers.ICellRenderer {

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

                const w = Math.floor(obj.width);
                const h = Math.floor(obj.height);

                const render = new Phaser.GameObjects.RenderTexture(
                    support.getScene(), 0, 0, w, h);

                render.draw(obj, 0, 0);

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