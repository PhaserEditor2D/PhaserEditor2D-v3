namespace phasereditor2d.scene.ui.sceneobjects {

    export class AnimationPreviewManager {

        private _parent: HTMLElement;
        private _game: Phaser.Game;

        constructor(parent: HTMLElement) {

            this._parent = parent;
        }

        dispose() {

            if (this._game) {

                ScenePlugin.getInstance().getCanvasManager().releaseCanvas(this._game.canvas);

                this._game.destroy(false);
            }
        }

        play(forceRepeat: boolean) {

            this._game.events.emit("play", forceRepeat);
        }

        createGame(data: IAnimationPreviewSceneData) {

            const { width, height } = this._parent.getBoundingClientRect();

            const canvas = ScenePlugin.getInstance().getCanvasManager().takeCanvas();

            this._game = new Phaser.Game({
                width, height: height - 5,
                parent: this._parent,
                canvas,
                type: ScenePlugin.DEFAULT_EDITOR_CANVAS_CONTEXT,
                transparent: true,
                pixelArt: true,
                fps: {
                    target: 30,
                },
                scale: {
                    mode: Phaser.Scale.ScaleModes.NONE,
                    resizeInterval: 10
                }
            });

            canvas.style.visibility = "hidden";

            this._game.scene.add("PreviewScene", PreviewScene, true, data);

            setTimeout(() => {

                canvas.style.visibility = "visible";

                this._game.scale.refresh();

            }, 10);
        }
    }

    export interface IAnimationPreviewSceneData {
        animationAsset: pack.core.BaseAnimationsAssetPackItem;
        config: Phaser.Types.Animations.PlayAnimationConfig,
        finder: pack.core.PackFinder
    }

    class PreviewScene extends Phaser.Scene {

        private _data: IAnimationPreviewSceneData;
        private _wheelListener: (e: WheelEvent) => void;

        init(data: IAnimationPreviewSceneData) {

            this._data = data;
        }

        preload() {

            const asset = this._data.animationAsset;

            if (asset instanceof pack.core.AnimationsAssetPackItem) {

                const cache = new pack.core.parsers.AssetPackCache();

                for (const item of this._data.finder.getAssets()) {

                    item.addToPhaserCache(this.game, cache);
                }

                this.load.animation(asset.getKey(), asset.getAnimationsFile().getExternalUrl());

            } else {

                const asset2 = asset as pack.core.AsepriteAssetPackItem;

                const textureURL = asset2.getTextureFile().getExternalUrl();
                const atlasURL = asset2.getAnimationsFile().getExternalUrl();

                this.load.aseprite(asset2.getKey(), textureURL, atlasURL);
            }
        }

        create() {

            this.anims.createFromAseprite(this._data.animationAsset.getKey());

            const obj = this.add.sprite(400, 400, null);

            obj.play(this._data.config);

            obj.on("drag", (pointer: any, dragX: number, dragY: number) => {

                obj.setPosition(dragX, dragY);
            });

            const w = 100000;

            obj.setInteractive({
                draggable: true,
                hitArea: new Phaser.Geom.Rectangle(-w, -w, w * 2, w * 2),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains
            });

            const camera = this.cameras.main;

            const gameWidth = camera.width;
            const gameHeight = camera.height;

            const fx = gameWidth / obj.width;
            const fy = gameHeight / obj.height;

            const z = Math.min(fx, fy);

            obj.setOrigin(0.5, 0.5);
            obj.setPosition(this.game.scale.width / 2, this.game.scale.height / 2);

            camera.zoom = z;

            this._wheelListener = (e: WheelEvent) => {

                const deltaY = e.deltaY;

                const scrollWidth = Math.abs(deltaY) * 2;

                const screenWidth = camera.width;

                const zoomDelta = scrollWidth / (screenWidth + scrollWidth);

                const zoomFactor = (deltaY > 0 ? 1 - zoomDelta : 1 + zoomDelta);

                camera.zoom *= zoomFactor;
                camera.zoom = Math.min(100, Math.max(0.2, camera.zoom));
            };

            this.game.canvas.addEventListener("wheel", this._wheelListener);

            this.game.events.on("play", (forceRepeat: boolean) => {

                if (forceRepeat) {

                    obj.play({ ...this._data.config, repeat: -1 });

                } else {

                    obj.play(this._data.config);
                }
            });

            this.game.events.once(Phaser.Core.Events.DESTROY, () => this.removeListeners());
        }

        private removeListeners() {

            this.game.canvas.removeEventListener("wheel", this._wheelListener);
        }
    }
}