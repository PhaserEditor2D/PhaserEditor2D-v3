namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineConfigWizard extends controls.dialogs.WizardDialog {

        private _finder: pack.core.PackFinder;
        private _spineDataPage: SpineDataPage;
        private _spineAtlasPage: SpineAtlasPage;
        private _initSpineDataAsset: pack.core.SpineBinaryAssetPackItem | pack.core.SpineJsonAssetPackItem;
        private _finishCallback: () => void;
        private _cancelCallback: () => void;

        constructor(finder: pack.core.PackFinder, spineDataAsset?: pack.core.SpineBinaryAssetPackItem | pack.core.SpineJsonAssetPackItem) {
            super();

            this._finder = finder;
            this._initSpineDataAsset = spineDataAsset;

            this.setSize(undefined, 500, true);
        }

        create() {

            if (this._initSpineDataAsset) {
                
                this._spineAtlasPage = new SpineAtlasPage();
                
                this.addPages(this._spineAtlasPage);

            } else {

                this._spineDataPage = new SpineDataPage();
                this._spineAtlasPage = new SpineAtlasPage();

                this.addPages(this._spineDataPage, this._spineAtlasPage);
            }

            super.create();

            this.setTitle("Spine Object Configuration");
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

        getSpineDataAssets() {

            return this._finder.getAssets(item => item instanceof pack.core.SpineJsonAssetPackItem
                || item instanceof pack.core.SpineBinaryAssetPackItem);
        }

        getSpineAtlasAssets() {

            return this._finder.getAssets(item => item instanceof pack.core.SpineAtlasAssetPackItem);
        }

        getSelection() {

            return {
                dataAsset: this._initSpineDataAsset || this._spineDataPage.getSpineDataAsset(),
                atlasAsset: this._spineAtlasPage.getSpineAtlasAsset()
            }
        }
    }

    class SpineDataPage extends controls.dialogs.WizardPage {

        private _viewer: controls.viewers.TreeViewer;
        private _spineDataAsset: pack.core.SpineJsonAssetPackItem | pack.core.SpineBinaryAssetPackItem;

        constructor() {
            super("Spine Data", "Select the JSON or Binary Spine data file.");
        }

        getSpineDataAsset() {

            return this._spineDataAsset;
        }

        createElements(parent: HTMLElement) {

            this._viewer = new controls.viewers.TreeViewer("phasereditor2d.scene.ui.sceneobjects.SpineDataPage");

            this._viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

            this._viewer.setLabelProvider(new controls.viewers.LabelProvider((spineAsset: pack.core.AssetPackItem) => {

                return spineAsset.getKey();
            }));

            this._viewer.setCellRendererProvider(
                controls.viewers.EmptyCellRendererProvider.withIcon(
                    resources.getIcon(resources.ICON_SPINE)));

            this._viewer.setInput(this.getWizard().getSpineDataAssets());

            const filteredViewer = new controls.viewers.FilteredViewerInElement(this._viewer, false);

            parent.appendChild(filteredViewer.getElement());

            this._viewer.eventSelectionChanged.addListener(sel => {

                this._spineDataAsset = this._viewer.getSelectionFirstElement();

                this.getWizard().updateWizardButtons();
            });

            this.updateUI();
        }

        private updateUI() {

            if (this._spineDataAsset) {

                this._viewer.setSelection([this._spineDataAsset]);
                this._viewer.reveal(this._spineDataAsset);
            }

            this.getWizard().updateWizardButtons();
        }

        canFinish() {

            return this.canGoNext();
        }

        canGoNext() {

            return this._spineDataAsset !== undefined && this._spineDataAsset !== null;
        }

        getWizard() {

            return super.getWizard() as SpineConfigWizard;
        }
    }

    class SpineAtlasPage extends controls.dialogs.WizardPage {

        private _viewer: controls.viewers.TreeViewer;
        private _spineAtlasAsset: pack.core.SpineAtlasAssetPackItem;

        constructor() {
            super("Spine Atlas", "Select the Spine Atlas file.");
        }

        getSpineAtlasAsset() {

            return this._spineAtlasAsset;
        }

        createElements(parent: HTMLElement) {

            this._viewer = new controls.viewers.TreeViewer("phasereditor2d.scene.ui.sceneobjects.SpineAtlasPage");

            this._viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

            this._viewer.setLabelProvider(new controls.viewers.LabelProvider((atlasAsset: pack.core.SpineAtlasAssetPackItem) => {

                return atlasAsset.getKey();
            }));

            this._viewer.setCellRendererProvider(new pack.ui.viewers.AssetPackCellRendererProvider("tree"));

            this._viewer.setInput(this.getWizard().getSpineAtlasAssets());

            const filteredViewer = new controls.viewers.FilteredViewerInElement(this._viewer, false);

            parent.appendChild(filteredViewer.getElement());

            this._viewer.eventSelectionChanged.addListener(sel => {

                this._spineAtlasAsset = this._viewer.getSelectionFirstElement();

                this.getWizard().updateWizardButtons();
            });

            setTimeout(() => {

                this._viewer.repaint();
                
            }, 100);

            this.updateUI();
        }

        private updateUI() {

            if (this._spineAtlasAsset) {

                this._viewer.setSelection([this._spineAtlasAsset]);
                this._viewer.reveal(this._spineAtlasAsset);
            }

            this.getWizard().updateWizardButtons();
        }

        canFinish() {

            return this.canGoNext();
        }

        canGoNext() {

            return this._spineAtlasAsset !== undefined && this._spineAtlasAsset !== null;
        }

        getWizard() {

            return super.getWizard() as SpineConfigWizard;
        }
    }
}