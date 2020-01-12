/// <reference path="../undo/SceneEditorOperation.ts" />

namespace phasereditor2d.scene.ui.editor.properties {

    export class ChangeSettingsPropertyOperation extends undo.SceneEditorOperation {

        private _name: string;
        private _value: any;
        private _oldValue: any;
        private _repaint: boolean;

        constructor(args: {
            editor: SceneEditor,
            name: string,
            value: any,
            repaint: boolean
        }) {
            super(args.editor);

            this._name = args.name;
            this._value = args.value;
            this._repaint = args.repaint;

            this._oldValue = this._editor.getScene().getSettings()[this._name];

            this.setValue(this._value);
        }

        private setValue(value: any) {

            this._editor.getScene().getSettings()[this._name] = value;

            this._editor.setSelection(this._editor.getSelection());

            this._editor.setDirty(true);

            if (this._repaint) {

                this._editor.repaint();
            }
        }

        undo(): void {

            this.setValue(this._oldValue);
        }

        redo(): void {

            this.setValue(this._value);
        }
    }
}