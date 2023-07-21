namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TilemapConfigWizard extends controls.dialogs.WizardDialog {
        private _finder: pack.core.PackFinder;
        private _tilemapKeyPage: TilemapKeyPage;
        private _tilesetsPage: TilesetsPage;
        private _finishCallback: () => void;
        private _cancelCallback: () => void;
        private _tilemapLayerNamePage: TilemapLayerNamePage;

        constructor(finder: pack.core.PackFinder) {
            super();

            this._finder = finder;

            this.setSize(undefined, 500, true);
        }

        getFinder() {

            return this._finder;
        }

        create() {

            this._tilemapKeyPage = new TilemapKeyPage();
            this._tilesetsPage = new TilesetsPage();
            this._tilemapLayerNamePage = new TilemapLayerNamePage();

            this.addPages(
                this._tilemapKeyPage,
                this._tilesetsPage,
                this._tilemapLayerNamePage);

            super.create();

            this.setTitle("Tilemap Configuration");
        }

        getTilemapKeyPage() {

            return this._tilemapKeyPage;
        }

        getTilesetsPage() {

            return this._tilesetsPage;
        }

        getTilemapLayerNamePage() {

            return this._tilemapLayerNamePage;
        }

        getTilemapAssets() {

            return this._finder
                .getAssets(a => a instanceof pack.core.TilemapTiledJSONAssetPackItem) as
                pack.core.TilemapTiledJSONAssetPackItem[];
        }

        setFinishCallback(cb: () => void) {

            this._finishCallback = cb;
        }

        setCancelCallback(cb: () => void) {

            this._cancelCallback = cb;
        }

        finishButtonPressed() {

            this._finishCallback();
        }

        cancelButtonPressed() {

            this._cancelCallback();
        }
    }

    class BasePage extends controls.dialogs.WizardPage {

        getWizard() {

            return super.getWizard() as TilemapConfigWizard;
        }
    }

    class TilemapKeyPage extends BasePage {

        private _tilemapAsset: pack.core.TilemapTiledJSONAssetPackItem;
        private _viewer: controls.viewers.TreeViewer;

        constructor() {
            super("Tilemap Key", "Select the tilemap key.");
        }

        getTilemapAsset() {

            return this._tilemapAsset;
        }

        createElements(parent: HTMLElement) {

            this._viewer = new controls.viewers.TreeViewer("phasereditor2d.scene.ui.sceneobjects.TilemapKeyPage");

            this._viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

            this._viewer.setLabelProvider(new controls.viewers.LabelProvider((tilemap: pack.core.TilemapTiledJSONAssetPackItem) => {

                return tilemap.getKey();
            }));

            this._viewer.setCellRendererProvider(
                controls.viewers.EmptyCellRendererProvider.withIcon(
                    resources.getIcon(resources.ICON_TILEMAP)));

            this._viewer.setInput(this.getWizard().getTilemapAssets());

            const filteredViewer = new controls.viewers.FilteredViewerInElement(this._viewer, false);

            parent.appendChild(filteredViewer.getElement());

            this._viewer.eventSelectionChanged.addListener(sel => {

                this._tilemapAsset = this._viewer.getSelectionFirstElement();

                this.getWizard().updateWizardButtons();
            });

            this.updateUI();
        }

        private updateUI() {

            if (this._tilemapAsset) {

                this._viewer.setSelection([this._tilemapAsset]);
                this._viewer.reveal(this._tilemapAsset);
            }

            this.getWizard().updateWizardButtons();
        }

        canFinish() {

            return this.canGoNext();
        }

        canGoNext() {

            return this._tilemapAsset !== undefined && this._tilemapAsset !== null;
        }
    }

    class TilesetsPage extends BasePage {

        private _imageMap: Map<string, pack.core.ImageAssetPackItem | pack.core.SpritesheetAssetPackItem>;
        private _assignButton: HTMLButtonElement;
        private _tilesetViewer: controls.viewers.TreeViewer;

        constructor() {
            super("Tilesets", "Assign an image to each tileset.");

            this._imageMap = new Map();
        }

        getImageMap() {

            return this._imageMap;
        }

        private autoSetImages() {

            this._imageMap = new Map();

            const tilesets = this.getWizard().getTilemapKeyPage().getTilemapAsset().getTilesetsData();

            for (const tileset of tilesets) {

                if (tileset.source) {

                    alert("Phaser does not support external tilesets.");

                    continue;
                }

                const asset = this.findTilesetImage(tileset.image);

                if (asset) {

                    this._imageMap.set(tileset.name, asset);
                }
            }
        }

        private findTilesetImage(tilesetImage: string) {

            const finder = this.getWizard().getFinder();

            const image1 = tilesetImage;
            const image2 = colibri.ui.ide.FileUtils.getFileNameWithoutExtension(image1);

            const split1 = image2.split("/");
            const image3 = split1[split1.length - 1];

            const split2 = image2.split("\\");
            const image4 = split2[split2.length - 1];

            for (const image of [image1, image2, image3, image4]) {

                const result = finder.findAssetPackItem(image);

                if (result && (result instanceof pack.core.ImageAssetPackItem
                    || result instanceof pack.core.SpritesheetAssetPackItem)) {

                    return result;
                }
            }

            return undefined;
        }

        createElements(parent: HTMLElement) {

            this.autoSetImages();

            const tilesets = this.getWizard().getTilemapKeyPage().getTilemapAsset().getTilesetsData();

            const comp = document.createElement("div");
            comp.style.display = "grid";
            comp.style.gridTemplateRows = "1fr auto";
            comp.style.gridTemplateColumns = "1fr";
            comp.style.rowGap = "5px";
            comp.style.height = "100%";
            parent.appendChild(comp);

            const viewerWrapperElement = document.createElement("div");
            viewerWrapperElement.style.height = "100%";
            comp.appendChild(viewerWrapperElement);

            this._tilesetViewer = new controls.viewers.TreeViewer("phasereditor2d.scene.ui.sceneobjects.TilesetsPage");
            this._tilesetViewer.setCellSize(64);
            this._tilesetViewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

            this._tilesetViewer.setLabelProvider(new controls.viewers.LabelProvider((tileset: pack.core.ITilesetData) => {
                return tileset.name;
            }));

            this._tilesetViewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider((obj: pack.core.ITilesetData) => {

                const item = this._imageMap.get(obj.name);

                if (item) {

                    return new controls.viewers.ImageCellRenderer(pack.core.AssetPackUtils.getImageFromPackUrl(item.getPack(), item.getUrl()))
                }

                return new controls.viewers.EmptyCellRenderer(false);
            }));

            this._tilesetViewer.setInput(tilesets);

            this._tilesetViewer.eventSelectionChanged.addListener(e => this.updateUI());

            this._tilesetViewer.eventOpenItem.addListener(e => this.openAssignImageDialog());

            const filteredViewer = new controls.viewers.FilteredViewerInElement(this._tilesetViewer, true);

            viewerWrapperElement.appendChild(filteredViewer.getElement());

            this._assignButton = document.createElement("button");
            this._assignButton.textContent = "Set Tileset Image";
            this._assignButton.style.justifySelf = "self-end";
            comp.appendChild(this._assignButton);

            this._assignButton.addEventListener("click", e => this.openAssignImageDialog());
        }

        private openAssignImageDialog() {

            const finder = this.getWizard().getFinder();

            const dlg = new pack.ui.dialogs.AssetSelectionDialog("tree");
            dlg.create(false);
            dlg.getViewer().setInput(
                finder.getAssets(
                    a => a instanceof pack.core.SpritesheetAssetPackItem
                        || a instanceof pack.core.ImageAssetPackItem));

            dlg.setSelectionCallback((sel) => {

                const tileset = this._tilesetViewer.getSelectionFirstElement() as pack.core.ITilesetData;

                const asset = sel[0];

                this._imageMap.set(tileset.name, asset);

                this.updateUI();
            });
        }

        canFinish() {

            const tilemap = this.getWizard().getTilemapKeyPage().getTilemapAsset();

            if (tilemap) {

                const tilesets = tilemap.getTilesetsData();

                for (const tileset of tilesets) {

                    if (!this._imageMap.has(tileset.name)) {

                        return false;
                    }
                }

                return true;
            }

            return false;
        }

        canGoNext() {

            return this.canFinish();
        }

        private updateUI() {

            this._assignButton.disabled = this._tilesetViewer.getSelection().length === 0;

            this._tilesetViewer.repaint();

            this.getWizard().updateWizardButtons();
        }
    }

    class TilemapLayerNamePage extends BasePage {
        private _viewer: controls.viewers.TreeViewer;
        private _tilemapLayerName: any;

        constructor() {
            super("Tilemap Layer", "Select a Tilemap Layer.")
        }

        createElements(parent: HTMLElement) {

            this._viewer = new controls.viewers.TreeViewer("phasereditor2d.scene.ui.sceneobjects.LayerPage");

            this._viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

            this._viewer.setLabelProvider(new controls.viewers.LabelProvider((name: string) => name));

            this._viewer.setCellRendererProvider(
                controls.viewers.EmptyCellRendererProvider.withIcon(
                    resources.getIcon(resources.ICON_TILEMAP_LAYER)));

            this._viewer.setInput(this.getWizard().getTilemapKeyPage().getTilemapAsset().getLayerNames());

            const filteredViewer = new controls.viewers.FilteredViewerInElement(this._viewer, false);

            parent.appendChild(filteredViewer.getElement());

            this._viewer.eventSelectionChanged.addListener(sel => {

                this._tilemapLayerName = this._viewer.getSelectionFirstElement();

                this.getWizard().updateWizardButtons();
            });

            this.updateUI();
        }

        getTilemapLayerName() {

            return this._tilemapLayerName;
        }

        private updateUI() {

            if (this._tilemapLayerName) {

                this._viewer.setSelection([this._tilemapLayerName]);
                this._viewer.reveal(this._tilemapLayerName);
            }

            this.getWizard().updateWizardButtons();
        }

        canFinish() {

            return true;
        }

        canGoBack() {

            return true;
        }

        canGoNext() {

            return true;
        }
    }
}