namespace phasereditor2d.scene.ui.sceneobjects {

    export class SpinePreviewManager {

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

        setAnimation(track: number, animationName: string, loop: boolean) {

            this._game.events.emit("updateAnimation", track, animationName, loop);
        }

        setSkin(skinName: string) {

            this._game.events.emit("updateSkinName", skinName);
        }

        setMixTime(mixTime: number) {

            this._game.events.emit("updateMixTime", mixTime);
        }

        setAnimationMixes(animationMixes: IAnimationMixes) {

            this._game.events.emit("updateAnimationMixes", animationMixes);
        }

        createGame(data: IPreviewSceneData) {

            const { width, height } = this._parent.getBoundingClientRect();

            this._game = new Phaser.Game({
                width, height,
                parent: this._parent,
                transparent: true,
                fps: {
                    target: 30,
                },
                scale: {
                    mode: Phaser.Scale.ScaleModes.NONE,
                    resizeInterval: 10
                },
                plugins: {
                    scene: [
                        { key: "spine.SpinePlugin", plugin: spine.SpinePlugin, mapping: "spine" }
                    ]
                }
            });

            this._game.canvas.classList.add("SpinePreviewCanvas");

            this._game.scene.add("PreviewScene", PreviewScene, true, data);

            setTimeout(() => this._game.scale.refresh(), 10);
        }
    }

    export interface IPreviewSceneData {
        spineAsset: pack.core.SpineAssetPackItem;
        spineAtlasAsset: pack.core.SpineAtlasAssetPackItem;
        skinName?: string;
        animationMixes?: IAnimationMixes;
        defaultMix?: number;
    }

    class PreviewScene extends Phaser.Scene {

        private _data: IPreviewSceneData;

        init(data: IPreviewSceneData) {

            this._data = data;
        }

        create() {

            console.log("repaintSpine", this._data.spineAsset.getKey(), this._data.spineAtlasAsset.getKey());

            const packCache = new pack.core.parsers.AssetPackCache();

            this._data.spineAtlasAsset.addToPhaserCache(this.game, packCache);
            this._data.spineAsset.addToPhaserCache(this.game, packCache);

            const key = this._data.spineAsset.getKey();
            const atlas = this._data.spineAtlasAsset.getKey();

            const obj = new spine.SpineGameObject(this, this.spine, 400, 400, key, atlas);

            this.add.existing(obj);
            this.sys.updateList.add(obj);

            obj.on("drag", (pointer: any, dragX: number, dragY: number) => {

                obj.setPosition(dragX, dragY);
            });

            obj.boundsProvider = new spine.SkinsAndAnimationBoundsProvider(
                null, obj.skeleton.data.skins.map(s => s.name));

            if (this._data.skinName) {

                obj.skeleton.setSkinByName(this._data.skinName);
            }

            obj.updateSize();

            if (this._data.animationMixes) {

                for (const mix of this._data.animationMixes) {

                    const [from, to, duration] = mix;

                    obj.animationStateData.setMix(from, to, duration);
                }
            }

            const w = 100000;

            obj.setInteractive({
                draggable: true,
                hitArea: new Phaser.Geom.Rectangle(-w, -w, w * 2, w * 2),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains
            });

            const objWidth = (obj as any).width
            const objHeight = (obj as any).height;

            const camera = this.cameras.main;

            const gameWidth = camera.width;
            const gameHeight = camera.height;

            const fx = gameWidth / objWidth;
            const fy = gameHeight / objHeight;
            const z = Math.min(fx, fy);

            const displayOriginX = objWidth * obj.originX;
            const displayOriginY = objHeight * obj.originY;
            const objCX = objWidth / 2;
            const objCY = objHeight / 2;
            const cx = gameWidth / 2 + displayOriginX - objCX;
            const cy = gameHeight / 2 + displayOriginY - objCY;

            obj.setPosition(cx, cy);

            camera.zoom = z;

            this.input.on("wheel", (pointer: any, over: any, deltaX: number, deltaY: number, deltaZ: number) => {

                const scrollWidth = Math.abs(deltaY) * 2;

                const screenWidth = camera.width;

                const zoomDelta = scrollWidth / (screenWidth + scrollWidth);

                const zoomFactor = (deltaY > 0 ? 1 - zoomDelta : 1 + zoomDelta);

                camera.zoom *= zoomFactor;
                camera.zoom = Math.min(4, Math.max(0.2, camera.zoom));
            });

            this.game.events.on("updateAnimation", (track: number, animationName: string, loop: boolean) => {

                if (animationName) {

                    obj.animationState.setAnimation(track, animationName, loop);

                } else {

                    obj.animationState.setEmptyAnimation(track);
                }
            });

            this.game.events.on("updateSkinName", (skinName: string) => {

                obj.skeleton.setSkinByName(skinName);
                obj.skeleton.setToSetupPose();
            });

            this.game.events.on("updateMixTime", (mixTime: number) => {

                obj.animationStateData.defaultMix = mixTime;
            });

            this.game.events.on("updateAnimationMixes", (mixes: IAnimationMixes) => {

                obj.animationStateData.animationToMixTime = {};

                for (const mix of mixes) {

                    const [from, to, duration] = mix;

                    obj.animationStateData.setMix(from, to, duration);
                }
            });
        }
    }
}