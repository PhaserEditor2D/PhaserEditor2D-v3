namespace phasereditor2d.scene.ui.dialogs {

    export class NewPrefabFileFromObjectDialogExtension extends NewPrefabFileDialogExtension {

        private _objectData: core.json.IObjectData;

        constructor(objectData: core.json.IObjectData) {
            super();

            this._objectData = objectData;
        }

        getCreateFileContentFunc() {

            return this.getCreatePrefabFileContentFunc([this._objectData]);
        }
    }
}