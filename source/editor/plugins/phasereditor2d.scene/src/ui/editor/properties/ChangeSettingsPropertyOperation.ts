/// <reference path="../undo/SceneEditorOperation.ts" />

namespace phasereditor2d.scene.ui.editor.properties {

    export class ChangeSettingsPropertyOperation extends undo.SceneEditorOperation {

        private _props: Array<{
            name: string,
            value: any,
        }>;

        private _before: Map<string, any>;
        private _after: Map<string, any>;
        private _repaint: boolean;

        constructor(args: {
            editor: SceneEditor,
            props: Array<{
                name: string,
                value: any,
            }>,
            repaint: boolean
        }) {
            super(args.editor);

            this._props = args.props;
            this._repaint = args.repaint;
        }

        async execute() {

            const settings = this._editor.getScene().getSettings();

            this._before = new Map();
            this._after = new Map();

            for (const prop of this._props) {

                this._before.set(prop.name, settings[prop.name]);
                this._after.set(prop.name, prop.value);
            }

            this.setValue(this._after);
        }

        private setValue(value: Map<string, any>) {

            const settings = this._editor.getScene().getSettings();

            for (const prop of this._props) {

                settings[prop.name] = value.get(prop.name);
            }

            this._editor.setSelection(this._editor.getSelection());

            this._editor.setDirty(true);

            if (this._repaint) {

                this._editor.repaint();
            }
        }

        undo(): void {

            this.setValue(this._before);
        }

        redo(): void {

            this.setValue(this._after);
        }
    }
}