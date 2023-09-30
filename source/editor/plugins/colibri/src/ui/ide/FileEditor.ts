namespace colibri.ui.ide {

    import io = core.io;

    export abstract class FileEditor extends EditorPart {

        private _onFileStorageListener: io.ChangeListenerFunc;
        private _savingThisEditor: boolean;

        constructor(id: string, factory: EditorFactory) {
            super(id, factory);

            this._onFileStorageListener = change => {

                this.onFileStorageChanged(change);

            };

            Workbench.getWorkbench().getFileStorage().addChangeListener(this._onFileStorageListener);
        }

        async save() {

            this._savingThisEditor = true;

            await super.save();
        }

        protected onFileStorageChanged(change: io.FileStorageChange) {

            const editorFile = this.getInput();

            const editorFileFullName = editorFile.getFullName();

            if (change.isDeleted(editorFileFullName)) {

                // this.getPartFolder().closeTab(this);

            } else if (change.isModified(editorFileFullName)) {

                if (this._savingThisEditor) {

                    this._savingThisEditor = false;

                } else {

                    this.getUndoManager().clear();

                    this.onEditorInputContentChangedByExternalEditor();
                }

            } else if (change.wasRenamed(editorFileFullName)) {

                this.setTitle(editorFile.getName());

                this.onEditorFileNameChanged();
            }
        }

        protected onEditorFileNameChanged() {
            // nothing
        }

        protected abstract onEditorInputContentChangedByExternalEditor();

        onPartClosed() {

            const closeIt = super.onPartClosed();

            if (closeIt) {
                Workbench.getWorkbench().getFileStorage().removeChangeListener(this._onFileStorageListener);
            }

            return closeIt;
        }

        setInput(file: io.FilePath) {

            super.setInput(file);

            this.setTitle(file.getName());
        }

        getInput(): core.io.FilePath {
            return super.getInput() as any;
        }

        getIcon() {

            const file = this.getInput();

            if (!file) {
                return Workbench.getWorkbench().getWorkbenchIcon(ICON_FILE);
            }

            const wb = Workbench.getWorkbench();
            const ct = wb.getContentTypeRegistry().getCachedContentType(file);
            const icon = wb.getContentTypeIcon(ct);

            return icon;
        }
    }
}