namespace colibri.ui.ide {

    import io = core.io;

    export abstract class FileEditor extends EditorPart {

        private _onFileStorageListener: io.ChangeListenerFunc;
        private _isSaving: boolean;

        constructor(id: string) {
            super(id);

            this._isSaving = false;

            this._onFileStorageListener = change => {
                this.onFileStorageChanged(change);
            };

            Workbench.getWorkbench().getFileStorage().addChangeListener(this._onFileStorageListener);
        }

        save() {

            this._isSaving = true;

            try {
                super.save();
            } finally {
                this._isSaving = false;
            }
        }

        protected isSaving() {
            return this._isSaving;
        }

        protected onFileStorageChanged(change: io.FileStorageChange) {

            const editorFile = this.getInput();

            const editorFileFullName = editorFile.getFullName();

            if (change.isDeleted(editorFileFullName)) {

                this.getPartFolder().closeTab(this);

            } else if (change.isModified(editorFileFullName)) {

                if (!this._isSaving) {
                    this.onEditorInputContentChanged();
                }

            } else if (change.wasRenamed(editorFileFullName)) {

                this.setTitle(editorFile.getName());
            }
        }

        protected abstract onEditorInputContentChanged();

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
            return super.getInput();
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