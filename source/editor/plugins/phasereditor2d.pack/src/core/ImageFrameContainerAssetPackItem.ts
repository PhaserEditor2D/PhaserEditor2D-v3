
namespace phasereditor2d.pack.core {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export abstract class ImageFrameContainerAssetPackItem extends AssetPackItem {

        private _frames: AssetPackImageFrame[];
        private _thumbnail: controls.IImage;
        private static _cache: Map<string, controls.IImage> = new Map();

        constructor(pack: AssetPack, data: any) {
            super(pack, data);

            this._frames = null;
        }

        getThumbnail() {

            return this._thumbnail;
        }

        async preload(): Promise<controls.PreloadResult> {

            if (this._frames) {

                return controls.Controls.resolveNothingLoaded();
            }

            const parser = this.createParser();

            return parser.preloadFrames();
        }

        async preloadImages(): Promise<controls.PreloadResult> {

            let result = controls.PreloadResult.NOTHING_LOADED;

            const frames = this.getFrames();

            for (const frame of frames) {

                result = Math.max(await frame.preload(), result);
            }

            const result2 = await this.makeThumbnail();

            return Math.max(result, result2);
        }

        static resetCache() {

            this._cache = new Map();
        }

        private getCacheKey() {

            const files = new Set<io.FilePath>();

            this.computeUsedFiles(files);

            const key = [...files]

                .filter(file => file !== null && file !== undefined)

                .map(file => file.getFullName() + "@" + file.getModTime()).join(",");

            return key;
        }

        private async makeThumbnail() {

            const cache = ImageFrameContainerAssetPackItem._cache;

            const key = this.getCacheKey();

            if (cache.has(key)) {

                this._thumbnail = cache.get(key);

                return controls.PreloadResult.NOTHING_LOADED;
            }

            const canvas = document.createElement("canvas");
            canvas.width = canvas.height = 256 * (window.devicePixelRatio || 1);
            canvas.style.width = canvas.style.height = canvas.width + "px";

            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = false;

            this.renderCanvas(ctx, canvas.width, this._frames);

            const img = document.createElement("img");

            const promise = new Promise<controls.PreloadResult>((resolve, reject) => {

                canvas.toBlob(blob => {

                    img.src = URL.createObjectURL(blob);

                    resolve(controls.PreloadResult.RESOURCES_LOADED);

                }, "image/png");
            });

            this._thumbnail = new controls.ImageWrapper(img);

            cache.set(key, this._thumbnail);

            return promise;
        }

        private renderCanvas(ctx: CanvasRenderingContext2D, canvasSize: number, frames: AssetPackImageFrame[]) {

            const maxCount = 4;

            const realCount = frames.length;

            if (realCount === 0) {
                return;
            }

            let frameCount = realCount;

            if (frameCount === 0) {
                return;
            }

            let step = 1;

            if (frameCount > maxCount) {
                step = frameCount / maxCount;
                frameCount = maxCount;
            }

            if (frameCount === 0) {
                frameCount = 1;
            }

            let cellSize = Math.floor(Math.sqrt(canvasSize * canvasSize / frameCount) * 0.8) + 1;

            if (frameCount === 1) {

                cellSize = canvasSize;
            }

            const cols = Math.floor(canvasSize / cellSize);
            const rows = frameCount / cols + (frameCount % cols === 0 ? 0 : 1);
            const marginX = Math.floor(Math.max(0, (canvasSize - cols * cellSize) / 2));
            const marginY = Math.floor(Math.max(0, (canvasSize - rows * cellSize) / 2));

            let itemX = 0;
            let itemY = 0;

            for (let i = 0; i < frameCount; i++) {

                if (itemY + cellSize > canvasSize) {
                    break;
                }

                const index = Math.min(realCount - 1, Math.round(i * step));

                const frame = frames[index];

                frame.paint(ctx, marginX + itemX, marginY + itemY, cellSize, cellSize, true);

                itemX += cellSize;

                if (itemX + cellSize > canvasSize) {
                    itemY += cellSize;
                    itemX = 0;
                }
            }
        }

        resetCache() {

            this._frames = null;
        }

        protected abstract createParser(): parsers.ImageFrameParser;

        findFrame(frameName: string | number) {

            return this.getFrames().find(f => f.getName() === frameName);
        }

        getFrames(): AssetPackImageFrame[] {

            if (this._frames === null) {

                const parser = this.createParser();

                this._frames = parser.parseFrames();
            }

            return this._frames;
        }

        addToPhaserCache(game: Phaser.Game, cache: parsers.AssetPackCache) {

            const parser = this.createParser();

            parser.addToPhaserCache(game, cache);
        }
    }
}