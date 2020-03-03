namespace colibri.ui.ide {

    export abstract class EditorPart extends Part {

        private _input: IEditorInput;
        private _dirty: boolean;

        constructor(id: string) {
            super(id);

            this.addClass("EditorPart");

            this._dirty = false;

        }

        setDirty(dirty: boolean) {

            this._dirty = dirty;

            const folder = this.getPartFolder();
            const label = folder.getLabelFromContent(this);

            const iconClose = ColibriPlugin.getInstance().getIcon(colibri.ICON_CONTROL_CLOSE);
            const iconDirty = dirty ? ColibriPlugin.getInstance().getIcon(colibri.ICON_CONTROL_DIRTY) : iconClose;

            folder.setTabCloseIcons(label, iconDirty, iconClose);
        }

        isDirty() {
            return this._dirty;
        }

        async save() {

            await this.doSave();
        }

        protected async doSave() {
            // nothing
        }

        onPartClosed() {

            const ext = Platform.getWorkbench().getEditorInputExtension(this.getInput());

            if (ext) {

                const id = ext.getEditorInputId(this.getInput());

                const state = {};

                this.saveState(state);

                Platform.getWorkbench().getEditorSessionStateRegistry().set(id, state);
            }

            if (this.isDirty()) {
                return confirm("This editor is not saved, do you want to close it?");
            }

            return true;
        }

        onPartAdded() {

            const ext = Platform.getWorkbench().getEditorInputExtension(this.getInput());
            const stateReg = Platform.getWorkbench().getEditorSessionStateRegistry();

            if (ext) {

                const id = ext.getEditorInputId(this.getInput());
                const state = stateReg.get(id);

                if (state) {
                    this.setRestoreState(state);
                }

                stateReg.delete(id);
            }
        }

        getInput() {
            return this._input;
        }

        setInput(input: IEditorInput): void {
            this._input = input;
        }

        getEditorViewerProvider(key: string): EditorViewerProvider {
            return null;
        }

        createEditorToolbar(parent: HTMLElement): controls.ToolbarManager {
            return null;
        }
    }
}