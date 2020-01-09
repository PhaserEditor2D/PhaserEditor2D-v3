namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TextureCellRenderer implements controls.viewers.ICellRenderer {

        private _finder: pack.core.PackFinder;
        private _image: controls.IImage;

        constructor() {

            this._finder = new pack.core.PackFinder();
        }

        renderCell(args: controls.viewers.RenderCellArgs): void {

            if (this._image) {

                this._image.paint(args.canvasContext, args.x, args.y, args.w, args.h, false);
            }
        }

        cellHeight(args: colibri.ui.controls.viewers.RenderCellArgs): number {

            return args.viewer.getCellSize();
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<colibri.ui.controls.PreloadResult> {

            let result = await this._finder.preload();

            const support = (args.obj as SceneObject).getEditorSupport();

            const textureComp = support.getComponent(TextureComponent) as TextureComponent;

            if (textureComp) {

                const { key, frame } = textureComp.getTexture();

                const item = this._finder.findAssetPackItem(key);

                let image: controls.IImage = null;

                if (item instanceof pack.core.ImageFrameContainerAssetPackItem) {

                    result = Math.max(await item.preload(), result);

                    result = Math.max(await item.preloadImages(), result);

                    if (item instanceof pack.core.ImageAssetPackItem) {

                        image = item.getFrames()[0].getImage();

                    } else {

                        image = item.findFrame(frame);
                    }
                }

                if (image) {

                    result = Math.max(await image.preload(), result);
                }

                this._image = image;
            }

            return result;
        }
    }
}