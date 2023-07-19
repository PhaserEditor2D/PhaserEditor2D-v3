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

        private _atlasImage: IImage;
        private _frameData: IAtlasFrameData;

        constructor(atlasImage: IImage, frameData: IAtlasFrameData) {

            this._atlasImage = atlasImage;
            this._frameData = frameData;
        }

        paint(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, center: boolean): void {

            const frame = this._frameData.frame;
            const sprite = this._frameData.spriteSourceSize;

            const factor = controls.ICON_SIZE === 32 ? 0.5 : 1;

            const ox = sprite.x * factor;
            const oy = sprite.y * factor;
            const ow = sprite.w * factor;
            const oh = sprite.h * factor;

            this._atlasImage.paintFrame(context,
                frame.x, frame.y, frame.w, frame.h,
                x + ox, y + oy, ow, oh);
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

            return this._frameData.sourceSize.w;
        }

        getHeight(): number {

            return this._frameData.sourceSize.h;
        }

        preloadSize(): Promise<PreloadResult> {

            // delegates resources loading
            // to the clients of this class

            return Controls.resolveResourceLoaded();
        }
    }
}