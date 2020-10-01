namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TextureCellRenderer implements controls.viewers.ICellRenderer {

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const image = this.getImage(args);

            if (image) {

                image.paint(args.canvasContext, args.x, args.y, args.w, args.h, false);

            } else {

                controls.DefaultImage.paintEmpty(args.canvasContext, args.x, args.y, args.w, args.h);
            }
        }

        private getImage(args: { obj: any }) {

            const obj = args.obj as ISceneGameObject;

            const support = obj.getEditorSupport();

            const textureComp = support.getComponent(TextureComponent) as TextureComponent;

            if (textureComp) {

                const { key, frame } = textureComp.getTextureKeys();

                const image = support.getScene().getPackCache().getImage(key, frame);

                return image;
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