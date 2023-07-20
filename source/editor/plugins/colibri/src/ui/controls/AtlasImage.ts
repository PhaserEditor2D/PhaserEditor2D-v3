namespace colibri.ui.controls {

    export interface ISize {
        w: number;
        h: number;
    }

    export interface IRect extends ISize {
        x: number;
        y: number;
    }

    export interface IAtlasFrameData {
        frame: IRect;
        spriteSourceSize: IRect;
        sourceSize: ISize;
    }

    export interface IAtlasData {

        frames: { [name: string]: IAtlasFrameData };
    }

    /**
     * Reads an image from an atlas. The atlas is in the JSON (Hash) format.
     */
    export class AtlasImage implements IImage {

        private _plugin: Plugin;
        private _frame: string;

        constructor(plugin: Plugin, frame: string) {

            this._plugin = plugin;
            this._frame = frame;
        }

        paint(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, center: boolean): void {

            const frameData = this.getFrameData();
            const atlasImage = this._plugin.getIconsAtlasImage();

            const frame = frameData.frame;
            const sprite = frameData.spriteSourceSize;

            const factor = controls.ICON_SIZE === 32 ? 0.5 : 1;

            const ox = sprite.x * factor;
            const oy = sprite.y * factor;
            const ow = sprite.w * factor;
            const oh = sprite.h * factor;

            atlasImage.paintFrame(context,
                frame.x, frame.y, frame.w, frame.h,
                x + ox, y + oy, ow, oh);
        }

        private getFrameData() {

            return this._plugin.getFrameDataFromIconsAtlas(this._frame);
        }

        paintFrame(context: CanvasRenderingContext2D, srcX: number, srcY: number, scrW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number): void {

            // not implemented
        }

        preload(): Promise<PreloadResult> {

            // delegates resources loading
            // to the clients of this class

            return Controls.resolveResourceLoaded();
        }

        getWidth(): number {

            return this.getFrameData().sourceSize.w;
        }

        getHeight(): number {

            return this.getFrameData().sourceSize.h;
        }

        preloadSize(): Promise<PreloadResult> {

            // delegates resources loading
            // to the clients of this class

            return Controls.resolveResourceLoaded();
        }
    }
}