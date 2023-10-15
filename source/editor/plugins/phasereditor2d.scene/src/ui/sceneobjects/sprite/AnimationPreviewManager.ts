namespace phasereditor2d.scene.ui.sceneobjects {

    export class AnimationPreviewManager {

        private _parent: HTMLElement;
        private _game: Phaser.Game;

        constructor(parent: HTMLElement) {

            this._parent = parent;
        }

        dispose() {

            if (this._game) {

                this._game.destroy(true);
            }
        }

        createGame(data: IAnimationPreviewSceneData) {

            const { width, height } = this._parent.getBoundingClientRect();

            this._game = new Phaser.Game({
                width, height,
                parent: this._parent,
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

            this._game.scene.add("PreviewScene", PreviewScene, true, data);

            setTimeout(() => this._game.scale.refresh(), 10);
        }
    }

    export interface IAnimationPreviewSceneData {
        animationAsset: pack.core.BaseAnimationsAssetPackItem;
        animationKey: string;
        finder: pack.core.PackFinder
    }

    class PreviewScene extends Phaser.Scene {

        private _data: IAnimationPreviewSceneData;

        init(data: IAnimationPreviewSceneData) {

            this._data = data;
        }

        preload() {

            const asset = this._data.animationAsset;

            if (asset instanceof pack.core.AnimationsAssetPackItem) {

                const cache = new pack.core.parsers.AssetPackCache();
                
                for(const item of this._data.finder.getAssets()) {

                    item.addToPhaserCache(this.game, cache);
                }

                this.load.animation(asset.getKey(), asset.getAnimationsFile().getExternalUrl());

            } else {

                const asset2 = asset as pack.core.AsepriteAssetPackItem;

                const textureURL = asset2.getTextureFile().getExternalUrl();
                const atlasURL = asset2.getAnimationsFile().getExternalUrl();

                console.log("load", textureURL, atlasURL);

                this.load.aseprite(asset2.getKey(), textureURL, atlasURL);
            }
        }

        create() {

            this.anims.createFromAseprite(this._data.animationAsset.getKey());

            const obj = this.add.sprite(400, 400, null);

            obj.play({
                key: this._data.animationKey,
                repeat: -1
            });

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

            this.input.on("wheel", (pointer: any, over: any, deltaX: number, deltaY: number, deltaZ: number) => {

                const scrollWidth = Math.abs(deltaY) * 2;

                const screenWidth = camera.width;

                const zoomDelta = scrollWidth / (screenWidth + scrollWidth);

                const zoomFactor = (deltaY > 0 ? 1 - zoomDelta : 1 + zoomDelta);

                camera.zoom *= zoomFactor;
                camera.zoom = Math.min(100, Math.max(0.2, camera.zoom));
            });
        }
    }
}