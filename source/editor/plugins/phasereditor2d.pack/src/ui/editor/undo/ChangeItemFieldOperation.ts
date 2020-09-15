namespace phasereditor2d.pack.ui.editor.undo {

    import ide = colibri.ui.ide;
    import json = colibri.core.json;

    export class ChangeItemFieldOperation extends ide.undo.Operation {

        private _editor: AssetPackEditor;
        private _itemIndexList: number[];
        private _fieldKey: string;
        private _newValueList: any[];
        private _oldValueList: any[];
        private _updateSelection: boolean;

        constructor(editor: AssetPackEditor, items: core.AssetPackItem[],
                    fieldKey: string, newValue: any, updateSelection: boolean = false) {
            super();

            this._editor = editor;
            this._itemIndexList = items.map(item => this._editor.getPack().getItems().indexOf(item));
            this._fieldKey = fieldKey;
            this._updateSelection = updateSelection;

            this._newValueList = [];

            this._oldValueList = items.map(item => json.getDataValue(item.getData(), fieldKey));

            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < items.length; i++) {
                this._newValueList.push(newValue);
            }

            this.load_async(this._newValueList);
        }

        undo(): void {
            this.load_async(this._oldValueList);
        }

        redo(): void {
            this.load_async(this._newValueList);
        }

        private async load_async(values: any[]) {

            for (let i = 0; i < this._itemIndexList.length; i++) {

                const index = this._itemIndexList[i];

                const item = this._editor.getPack().getItems()[index];

                json.setDataValue(item.getData(), this._fieldKey, values[i]);

                item.resetCache();

                await item.preload();
            }

            this._editor.repaintEditorAndOutline();

            this._editor.setDirty(true);

            if (this._updateSelection) {

                this._editor.dispatchSelectionChanged();
            }
        }
    }
}