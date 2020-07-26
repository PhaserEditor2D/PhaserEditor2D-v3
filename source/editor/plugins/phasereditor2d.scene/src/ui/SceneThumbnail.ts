namespace phasereditor2d.scene.ui {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import io = colibri.core.io;

    class ThumbnailScene extends Scene {

        private _data: core.json.ISceneData;
        private _callback: (element: HTMLImageElement) => void;

        constructor(data: core.json.ISceneData, callback: (element: HTMLImageElement) => void) {
            super();

            if (data.sceneType === core.json.SceneType.PREFAB) {

                if (data.displayList.length > 1) {

                    data.displayList.splice(0, data.displayList.length - 1);
                }
            }

            this._data = data;

            this._callback = callback;
        }

        async create() {

            this.registerDestroyListener("ThumbnailScene");

            const maker = this.getMaker();

            await maker.preload();

            await maker.updateSceneLoader(this._data);

            maker.createScene(this._data);

            let bounds = this.computeSceneBounds();

            const s = this.getSettings();

            if (bounds.width > s.borderWidth && bounds.height > s.borderHeight) {

                bounds = {
                    x: s.borderX,
                    y: s.borderY,
                    width: s.borderWidth,
                    height: s.borderHeight
                };
            }

            console.log(bounds);

            this.sys.renderer.snapshotArea(bounds.x, bounds.y, bounds.width, bounds.height, (img: HTMLImageElement) => {

                this._callback(img);

                this.destroyGame();
            });
        }

        private computeSceneBounds() {

            const children = this.getDisplayListChildren();

            if (children.length === 0) {

                return { x: 0, y: 0, width: 10, height: 10 };
            }

            const camera = this.getCamera();

            let minX = Number.MAX_VALUE;
            let minY = Number.MAX_VALUE;
            let maxX = Number.MIN_VALUE;
            let maxY = Number.MIN_VALUE;

            for (const obj of this.getDisplayListChildren()) {

                const points = obj.getEditorSupport().getScreenBounds(camera);

                for (const point of points) {

                    minX = Math.min(minX, point.x);
                    minY = Math.min(minY, point.y);
                    maxX = Math.max(maxX, point.x);
                    maxY = Math.max(maxY, point.y);
                }
            }

            return {
                x: Math.floor(minX),
                y: Math.floor(minY),
                width: Math.floor(maxX - minX),
                height: Math.floor(maxY - minY)
            };
        }
    }

    export class SceneThumbnail implements controls.IImage {

        private _file: io.FilePath;
        private _image: controls.ImageWrapper;
        private _promise: Promise<controls.PreloadResult>;

        constructor(file: io.FilePath) {
            this._file = file;
            this._image = null;
        }

        paint(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, center: boolean): void {

            if (this._image) {
                this._image.paint(context, x, y, w, h, center);
            }
        }

        paintFrame(
            context: CanvasRenderingContext2D, srcX: number, srcY: number, srcW: number, srcH: number,
            dstX: number, dstY: number, dstW: number, dstH: number): void {

            if (this._image) {
                this._image.paintFrame(context, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
            }
        }

        getWidth(): number {
            return this._image ? this._image.getWidth() : 16;
        }

        getHeight(): number {
            return this._image ? this._image.getHeight() : 16;
        }

        preloadSize(): Promise<controls.PreloadResult> {
            return this.preload();
        }

        async preload(): Promise<controls.PreloadResult> {

            if (this._image == null) {

                if (this._promise) {
                    return this._promise;
                }

                this._promise = ide.FileUtils.preloadFileString(this._file)

                    .then(() => this.createImageElement())

                    .then(imageElement => {

                        this._image = new controls.ImageWrapper(imageElement);

                        this._promise = null;

                        return controls.PreloadResult.RESOURCES_LOADED;
                    });

                return this._promise;
            }

            return controls.Controls.resolveNothingLoaded();
        }

        private createImageElement() {

            return new Promise<HTMLImageElement>((resolve, reject) => {

                const content = ide.FileUtils.getFileString(this._file);

                const data: core.json.ISceneData = JSON.parse(content);

                // const width = 1200;
                // const height = 800;

                const width = data.settings.borderWidth || 800;
                const height = data.settings.borderHeight || 600;

                const canvas = document.createElement("canvas");
                canvas.style.width = (canvas.width = width) + "px";
                canvas.style.height = (canvas.height = height) + "px";

                const parent = document.createElement("div");
                parent.style.position = "fixed";
                parent.style.left = -width - 10 + "px";
                parent.appendChild(canvas);

                document.body.appendChild(parent);

                const game = new Phaser.Game({
                    type: ScenePlugin.DEFAULT_CANVAS_CONTEXT,
                    canvas: canvas,
                    parent: null,
                    width: width,
                    height: height,
                    scale: {
                        mode: Phaser.Scale.NONE
                    },
                    render: {
                        pixelArt: true,
                        transparent: true
                    },
                    audio: {
                        noAudio: true
                    }
                });

                const scene = new ThumbnailScene(data, image => {

                    resolve(image);

                    scene.destroyGame();

                    parent.remove();
                });

                game.scene.add("scene", scene, true);
            });
        }
    }
}