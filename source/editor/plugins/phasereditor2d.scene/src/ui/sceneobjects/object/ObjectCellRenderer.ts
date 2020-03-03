namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ObjectCellRenderer implements controls.viewers.ICellRenderer {

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const obj = args.obj as Image;

            const support = obj.getEditorSupport();

            const hash = support.computeContentHash();

            const key = "__renderer__image_" + hash;

            const cached = obj.getData(key) as controls.IImage;

            if (cached) {

                cached.paint(args.canvasContext, args.x, args.y, args.w, args.h, false);

                return;
            }

            // send image to garbage.
            obj.data.remove("__last_renderer_image");

            const angle = obj.angle;
            obj.setAngle(0);

            const render = new Phaser.GameObjects.RenderTexture(
                support.getScene(), 0, 0, obj.width, obj.height);

            render.draw(obj, 0, 0);

            render.snapshot(imgElement => {

                const img = new controls.ImageWrapper(imgElement as HTMLImageElement);

                obj.setData("__last_renderer_image", img);
                obj.setData(key, img);

                img.paint(args.canvasContext, args.x, args.y, args.w, args.h, false);
            });

            obj.setAngle(angle);

            render.destroy();
        }

        cellHeight(args: controls.viewers.RenderCellArgs): number {

            return args.viewer.getCellSize();
        }

        preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            return controls.Controls.resolveNothingLoaded();
        }
    }
}