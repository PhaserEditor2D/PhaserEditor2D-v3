namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TilemapConfigWizard extends controls.dialogs.WizardDialog {
        private _finder: pack.core.PackFinder;
        private _tilemapKeyPage: TilemapKeyPage;
        private _tilesetsPage: TilesetsPage;
        private _finishCallback: () => void;
        private _cancelCallback: () => void;

        constructor(finder: pack.core.PackFinder) {
            super();

            this._finder = finder;

            this.setSize(undefined, window.innerHeight * 0.5);
        }

        getFinder() {

            return this._finder;
        }

        create() {

            this._tilemapKeyPage = new TilemapKeyPage();
            this._tilesetsPage = new TilesetsPage();

            this.addPages(
                this._tilemapKeyPage,
                this._tilesetsPage);

            super.create();

            this.setTitle("Tilemap Configuration");
        }

        getTilemapKeyPage() {

            return this._tilemapKeyPage;
        }

        getTilesetsPage() {

            return this._tilesetsPage;
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
                    pack.AssetPackPlugin.getInstance().getIcon(pack.ICON_TILEMAP)));

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

        private _imageMap: Map<string, pack.core.ImageAssetPackItem|pack.core.SpritesheetAssetPackItem>;
        private _assignButton: HTMLButtonElement;
        private _tilesetViewer: controls.viewers.TreeViewer;

        constructor() {
            super("Tilesets", "Assign an image to each tileset.");

            this._imageMap = new Map();
        }

        getImageMap() {

            return this._imageMap;
        }

        createElements(parent: HTMLElement) {

            this._imageMap = new Map();

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

                    return new controls.viewers.ImageCellRenderer(pack.core.AssetPackUtils.getImageFromPackUrl(item.getUrl()))
                }

                return new controls.viewers.EmptyCellRenderer(false);
            }));

            this._tilesetViewer.setInput(this.getWizard().getTilemapKeyPage().getTilemapAsset().getTilesetsData());

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

        private updateUI() {

            this._assignButton.disabled = this._tilesetViewer.getSelection().length === 0;

            this._tilesetViewer.repaint();

            this.getWizard().updateWizardButtons();
        }
    }
}