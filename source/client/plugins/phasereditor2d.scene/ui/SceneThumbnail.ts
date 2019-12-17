namespace phasereditor2d.scene.ui {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import core = colibri.core;

    class ThumbnailScene extends GameScene {

        private _data: json.SceneData;
        private _callback: (HTMLImageElement) => void;

        constructor(data: json.SceneData, callback: (HTMLImageElement) => void) {
            super(false);

            this._data = data;
            this._callback = callback;
        }

        create() {
            const parser = new json.SceneParser(this);
            parser.createSceneCache_async(this._data)
                .then(() => {

                    parser.createScene(this._data);

                    this.sys.renderer.snapshot(img => {

                        this._callback(<HTMLImageElement>img);

                    });
                });
        }
    }

    export class SceneThumbnail implements controls.IImage {

        private _file: core.io.FilePath;
        private _image: controls.ImageWrapper;
        private _promise: Promise<controls.PreloadResult>;

        constructor(file: core.io.FilePath) {
            this._file = file;
            this._image = null;
        }

        paint(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, center: boolean): void {

            if (this._image) {
                this._image.paint(context, x, y, w, h, center);
            }
        }

        paintFrame(context: CanvasRenderingContext2D, srcX: number, srcY: number, srcW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number): void {

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

        preloadSize() : Promise<controls.PreloadResult> {
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

                const data: json.SceneData = JSON.parse(content);

                const width = 800;
                const height = 600;

                const canvas = document.createElement("canvas");
                canvas.style.width = (canvas.width = width) + "px";
                canvas.style.height = (canvas.height = height) + "px";

                const parent = document.createElement("div");
                parent.style.position = "fixed";
                parent.style.left = -width - 10 + "px";
                parent.appendChild(canvas);

                document.body.appendChild(parent);

                const scene = new ThumbnailScene(data, image => {
                    resolve(image);
                    parent.remove();
                });

                const game = new Phaser.Game({
                    type: Phaser.WEBGL,
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
                    },
                    scene: scene,
                });
            });
        }

    }

}