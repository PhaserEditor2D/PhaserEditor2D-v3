namespace phasereditor2d.scene.ui.editor.scripts {

    export class ObjectScriptEditorModel {

        private _scripts: ObjectScript[];

        constructor() {

            this._scripts = [];
        }

        getScripts() {

            return this._scripts;
        }
    }
}