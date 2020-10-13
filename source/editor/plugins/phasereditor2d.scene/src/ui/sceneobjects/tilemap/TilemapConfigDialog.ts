namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TilemapConfigDialog extends controls.dialogs.Dialog {

        private _tilemapAsset: pack.core.TilemapTiledJSONAssetPackItem;
        private _tilesetImages: Map<string, pack.core.ImageAssetPackItem | pack.core.SpritesheetAssetPackItem> = new Map();
        private _tilemapButton: HTMLButtonElement;
        private _finder: pack.core.PackFinder;
        private _clientArea: HTMLDivElement;
        private _tilesetElements: HTMLElement[] = [];
        private _createTilemapButton: HTMLButtonElement;
        private _createCallback: () => void;
        private _cancelCallback: () => void;

        constructor() {
            super();

            this.setSize(window.innerWidth * 0.3, window.innerHeight * 0.5);
        }

        createDialogArea() {

            this.getElement().style.height = "auto";

            const comp = document.createElement("div");
            this._clientArea = comp;
            comp.classList.add("DialogClientArea", "formGrid", "formSimpleProps");
            comp.style.gridTemplateColumns = "auto 1fr";
            comp.style.width = "auto";
            comp.style.height = "auto";
            comp.style.alignSelf = "baseline";

            const messageElement = document.createElement("div");
            messageElement.innerHTML = "<p>Configure the Tilemap properties</p>";
            messageElement.style.gridColumn = "1 / span 2";
            comp.appendChild(messageElement);

            this.createSeparator(comp, "Tilemap");

            this.createLabel(comp, "Key");

            this._tilemapButton = this.createButton(comp, "(select tilemap...)", async (e) => {

                const assets = this.getTilemapAssets();

                const menu = new controls.Menu();

                for (const asset of assets) {

                    menu.addAction({
                        text: asset.getKey(),
                        icon: pack.AssetPackPlugin.getInstance().getIcon(pack.ICON_TILEMAP),
                        callback: () => {

                            if (asset !== this._tilemapAsset) {

                                this._tilemapAsset = asset;
                                this._tilemapButton.textContent = this._tilemapAsset.getKey();

                                this.generateTilesetFields();
                                this.validateData();
                            }
                        }
                    });
                }

                menu.createWithEvent(e);
            });

            this.getElement().appendChild(comp);

            this._finder = new pack.core.PackFinder();

            this._finder.preload().then(() => {

                const assets = this.getTilemapAssets();

                if (assets.length === 1) {

                    this._tilemapAsset = assets[0];
                    this._tilemapButton.textContent = this._tilemapAsset.getKey();
                }

                this.generateTilesetFields();
                this.validateData();
            });
        }

        private findTilesetImage(tilesetImage: string) {

            const image1 = tilesetImage;
            const image2 = colibri.ui.ide.FileUtils.getFileNameWithoutExtension(image1);

            const split1 = image2.split("/");
            const image3 = split1[split1.length - 1];

            const split2 = image2.split("\\");
            const image4 = split2[split2.length - 1];

            for (const image of [image1, image2, image3, image4]) {

                const result = this._finder.findAssetPackItem(image);

                if (result && (result instanceof pack.core.ImageAssetPackItem
                    || result instanceof pack.core.SpritesheetAssetPackItem)) {

                    return result;
                }
            }

            return undefined;
        }

        private generateTilesetFields() {

            for (const elem of this._tilesetElements) {

                elem.remove();
            }

            this._tilesetElements = [];

            this._tilesetImages = new Map();

            if (this._tilemapAsset) {

                const sep = this.createSeparator(this._clientArea, "Tilesets");

                this._tilesetElements.push(sep);

                const tilesets = this._tilemapAsset.getTilesetsData();

                for (const tileset of tilesets) {

                    const label = this.createLabel(this._clientArea, tileset.name, true);

                    const btn = this.createButton(this._clientArea, "(select image...)", () => {

                        const dlg = new pack.ui.dialogs.AssetSelectionDialog("tree");
                        dlg.create(false);
                        dlg.getViewer().setInput(
                            this._finder.getAssets(
                                a => a instanceof pack.core.SpritesheetAssetPackItem
                                    || a instanceof pack.core.ImageAssetPackItem));

                        dlg.setSelectionCallback((sel) => {

                            const asset = sel[0];

                            const key = asset.getKey();

                            btn.textContent = key;

                            this._tilesetImages.set(tileset.name, asset);

                            this.validateData();
                        });

                    }, true);

                    const tilesetImage = this.findTilesetImage(tileset.name);

                    if (tilesetImage) {

                        this._tilesetImages.set(tileset.name, tilesetImage);

                        btn.textContent = tilesetImage.getKey();
                    }

                    this._tilesetElements.push(label, btn);
                }
            }
        }

        private getTilemapAssets() {

            return this._finder
                .getAssets(a => a instanceof pack.core.TilemapTiledJSONAssetPackItem) as
                pack.core.TilemapTiledJSONAssetPackItem[];
        }

        private validateData() {

            let disabled = false;

            if (this._tilemapAsset) {

                for (const { name, image } of this._tilemapAsset.getTilesetsData()) {

                    if (!this._tilesetImages.has(name)) {

                        disabled = true;
                        break;
                    }
                }

            } else {

                disabled = true;
            }

            this._createTilemapButton.disabled = disabled;
        }

        setCreateCallback(callback: () => void) {

            this._createCallback = callback;
        }

        setCancelCallback(callback: () => void) {

            this._cancelCallback = callback;
        }

        getTilemapAsset() {

            return this._tilemapAsset;
        }

        getTilesetsImages() {

            return this._tilesetImages;
        }

        create() {

            super.create();

            this.setTitle("Tilemap Configuration");

            this._createTilemapButton = this.addButton("Create Tilemap", () => {

                this.close();

                if (this._createCallback) {

                    this._createCallback();
                }
            });

            this.addCancelButton(() => {

                if (this._cancelCallback) {

                    this._cancelCallback();
                }
            });

            this._createTilemapButton.disabled = true;
        }

        private createButton(parent: HTMLElement, text: string, callback: (e: MouseEvent) => void, fullWidth = false) {

            const btn = document.createElement("button");

            if (fullWidth) {

                btn.style.gridColumn = "1 / span 2";
            }

            btn.classList.add("alignLeft");

            btn.textContent = text;

            btn.addEventListener("click", e => {

                callback(e);
            });

            parent.appendChild(btn);

            return btn;
        }

        private createSeparator(parent: HTMLElement, text: string) {

            const label = this.createLabel(parent, text, true);
            label.style.fontWeight = "bold";
            label.style.margin = "5px 0 5px 0";

            return label;
        }

        private createLabel(parent: HTMLElement, text: string, fullWidth = false) {

            const label = document.createElement("label");

            if (fullWidth) {

                label.style.gridColumn = "1 / span 2";
            }

            label.textContent = text;
            parent.appendChild(label);

            return label;
        }

    }
}