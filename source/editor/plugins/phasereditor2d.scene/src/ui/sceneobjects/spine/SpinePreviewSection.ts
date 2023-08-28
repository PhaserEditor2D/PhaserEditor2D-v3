namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpinePreviewSection extends controls.properties.PropertySection<pack.core.SpineAssetPackItem | pack.core.SpineSkinItem> {

        static ID = "phasereditor2d.scene.ui.sceneobjects.SpinePreviewSection";
        private _game: Phaser.Game;
        private _selectedSkinName: string;
        private _skinBtn: HTMLButtonElement;

        constructor(page: controls.properties.PropertyPage) {
            super(page, SpinePreviewSection.ID, "Spine Preview", true, false);
        }

        createForm(parent: HTMLDivElement): void {

            parent.style.gridTemplateColumns = "1fr";
            parent.style.gridTemplateRows = "auto 1fr";

            this.addUpdater(() => {

                const obj = this.getSelectionFirstElement();

                if (obj instanceof pack.core.SpineSkinItem) {

                    this._selectedSkinName = obj.skinName;

                } else {

                    const atlas = obj.guessAtlasAsset();

                    this.setDefaultSkin(obj, atlas);
                }

                this.updatePreview();
            });

            this.createSettings(parent);

            this.createGameCanvas(parent);
        }

        private createSettings(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            this.createLabel(comp, "Skin");

            this._skinBtn = this.createMenuButton(comp, "",
                () => this.getSelectedSpineAsset()
                    .getGuessSkinItems()
                    .map(i => ({ name: i.skinName, value: i.skinName })),
                selectedSkin => {

                    this._selectedSkinName = selectedSkin;

                    this._skinBtn.textContent = this._selectedSkinName;

                    this.updatePreview();
                });

            this.addUpdater(() => {

                this._skinBtn.textContent = this._selectedSkinName;
            });
        }

        private createGameCanvas(parent: HTMLDivElement) {

            const gameContainerElement = document.createElement("div");
            gameContainerElement.style.width = "100%";

            parent.appendChild(gameContainerElement);

            class Level extends Phaser.Scene {

                private _spineAsset: pack.core.SpineAssetPackItem;
                private _atlasAsset: pack.core.SpineAtlasAssetPackItem;
                private _skinName: string;

                init(data: any) {

                    this._spineAsset = data.spineAsset;
                    this._atlasAsset = data.spineAtlasAsset;
                    this._skinName = data.skinName;
                }

                create() {

                    console.log("repaintSpine", this._spineAsset.getKey(), this._atlasAsset.getKey(), this._skinName);

                    const packCache = new pack.core.parsers.AssetPackCache();

                    this._atlasAsset.addToPhaserCache(this.game, packCache);
                    this._spineAsset.addToPhaserCache(this.game, packCache);

                    const key = this._spineAsset.getKey();
                    const atlas = this._atlasAsset.getKey();

                    const obj = new spine.SpineGameObject(this, this.spine, 400, 400, key, atlas);

                    this.add.existing(obj);

                    if (this._skinName) {

                        obj.skeleton.setSkinByName(this._skinName);

                        obj.boundsProvider = new spine.SkinsAndAnimationBoundsProvider(null, [this._skinName]);

                    } else {

                        obj.boundsProvider = new spine.SkinsAndAnimationBoundsProvider(
                            null, obj.skeleton.data.skins.map(s => s.name));
                    }

                    obj.updateSize();

                    const objWidth = obj.skeleton.data.width;
                    const objHeight = obj.skeleton.data.height;

                    const camera = this.cameras.main;

                    const gameWidth = camera.width;
                    const gameHeight = camera.height;

                    let z = 1.05;

                    if (objWidth > gameWidth || objHeight > gameHeight) {

                        const fx = gameWidth / objWidth;
                        const fy = gameHeight / objHeight;

                        z = Math.min(fx, fy);
                    }

                    const displayOriginX = objWidth * obj.originX;
                    const displayOriginY = objHeight * obj.originY;
                    const objCX = objWidth / 2;
                    const objCY = objHeight / 2;
                    const cx = gameWidth / 2 + displayOriginX - objCX;
                    const cy = gameHeight / 2 + displayOriginY - objCY;

                    obj.setPosition(cx, cy);

                    camera.zoomTo(z, 100);
                }
            }

            const game = new Phaser.Game({
                parent: gameContainerElement,
                width: 800,
                height: 1200,
                transparent: true,
                scale: {
                    autoCenter: Phaser.Scale.Center.CENTER_BOTH,
                    mode: Phaser.Scale.ScaleModes.FIT,
                    resizeInterval: 10
                },
                plugins: {
                    scene: [
                        { key: "spine.SpinePlugin", plugin: spine.SpinePlugin, mapping: "spine" }
                    ]
                }
            });

            gameContainerElement.style.height = "450px";

            game.scene.add("Level", Level);

            this._game = game;
        }

        private setDefaultSkin(spineAsset: pack.core.SpineAssetPackItem, atlasAsset: pack.core.SpineAtlasAssetPackItem) {

            const data = spineAsset.getGuessSkeleton();

            if (data.defaultSkin) {

                this._selectedSkinName = data.defaultSkin.name;

            } else {

                this._selectedSkinName = data.skins[0].name;
            }
        }

        private updatePreview() {

            const spineAsset = this.getSelectedSpineAsset();
            const spineAtlasAsset = spineAsset.guessAtlasAsset();

            this._game.scene.start("Level", {
                spineAsset,
                spineAtlasAsset,
                skinName: this._selectedSkinName
            });

            setTimeout(() => {

                this._game.scale.refresh();

            }, 100);
        }

        getSelectedSpineAsset() {

            const asset = this.getSelectionFirstElement();

            if (asset instanceof pack.core.SpineSkinItem) {

                return asset.spineAsset;
            }

            return asset;
        }

        getSelectedSpineSkinItem() {

            const asset = this.getSelectionFirstElement();

            if (asset instanceof pack.core.SpineSkinItem) {

                return asset;
            }

            return null;
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof pack.core.SpineAssetPackItem
                || obj instanceof pack.core.SpineSkinItem;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}