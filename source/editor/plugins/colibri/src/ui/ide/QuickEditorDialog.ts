namespace colibri.ui.ide {

    import io = colibri.core.io;

    class DialogEditorArea extends controls.Control {

        constructor() {
            super("div", "DialogClientArea");
        }

        layout() {

            this.layoutChildren();

            this.dispatchLayoutEvent();
        }
    }

    export class QuickEditorDialog extends controls.dialogs.Dialog {

        private _file: io.FilePath;
        private _editor: colibri.ui.ide.EditorPart;
        private _saveButton: HTMLButtonElement;
        private _editorState: any;

        constructor(file: io.FilePath, editorState?: any) {
            super("QuickEditorDialog");

            this._file = file;
            this._editorState = editorState;

            this.setSize(1100, 800, true);
        }

        goFront() {

            this.layout();
        }

        createDialogArea() {

            this._editor = colibri.Platform.getWorkbench().makeEditor(this._file);

            this._editor.setEmbeddedMode(true);

            this._editor.onPartShown();

            const editorArea = new DialogEditorArea();

            editorArea.add(this._editor);

            this.add(editorArea);

            setTimeout(() => {

                editorArea.layout();

                this._editor.restoreEmbeddedEditorState(this._editorState);

                this._editorState = null;

            }, 1);

            this._editor.onPartActivated();
        }

        processKeyCommands() {

            return true;
        }

        create() {

            super.create();

            this.setTitle(this._file.getName());

            this.addButton("Close", () => {

                this.close();

            });

            this._saveButton = this.addButton("Save", () => {

                this._editor.save();
            });

            this._saveButton.disabled = true;

            this._editor.eventDirtyStateChanged.addListener(dirty => {

                this._saveButton.disabled = !dirty;
            });
        }

        close() {

            this._editorState = this._editor.getEmbeddedEditorState();

            if (this._editor.onPartClosed()) {

                super.close();
            }
        }

        getEditorState() {

            return this._editorState;
        }

        getEditor() {

            return this._editor;
        }
    }
}