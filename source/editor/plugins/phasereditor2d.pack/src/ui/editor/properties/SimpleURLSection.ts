namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class SimpleURLSection extends BaseSection {

        private _label: string;
        private _dataKey: string;
        private _contentType: string;
        private _assetPackType: string;

        constructor(page: controls.properties.PropertyPage, id: string, title: string,
                    fieldLabel: string, dataKey: string, contentType: string, assetPackType: string) {

            super(page, id, title, assetPackType, false);

            this._label = fieldLabel;
            this._dataKey = dataKey;
            this._contentType = contentType;
            this._assetPackType = assetPackType;
        }

        canEdit(obj: any, n: number) {
            return super.canEdit(obj, n) && obj.getType() === this._assetPackType;
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createFileField(comp, this._label, this._dataKey, this._contentType,
                `Phaser.Loader.LoaderPlugin.${this._assetPackType}(${this._dataKey})`);
        }
    }
}