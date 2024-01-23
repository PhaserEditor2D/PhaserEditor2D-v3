namespace colibri.ui.ide {

    export abstract class EditorPart extends Part {

        public eventDirtyStateChanged = new controls.ListenerList<boolean>();

        private _input: IEditorInput;
        private _dirty: boolean;
        private _readOnly: boolean;
        private _embeddedMode: boolean;
        private _editorFactory: EditorFactory;

        constructor(id: string, factory: EditorFactory) {
            super(id);

            this.addClass("EditorPart");

            this._dirty = false;

            this._embeddedMode = false;

            this._editorFactory = factory;
        }

        setReadOnly(readOnly: boolean) {

            this._readOnly = readOnly;

            if (this.isInEditorArea()) {

                const folder = this.getPartFolder();
                const label = folder.getLabelFromContent(this);

                folder.setTabReadOnly(label, this._readOnly);
            }
        }

        isReadOnly() {

            return this._readOnly;
        }

        getEditorFactory() {

            return this._editorFactory;
        }

        isEmbeddedMode() {

            return this._embeddedMode;
        }

        isInEditorArea() {

            return !this.isEmbeddedMode();
        }

        setEmbeddedMode(embeddedMode: boolean) {

            this._embeddedMode = embeddedMode;
        }

        setDirty(dirty: boolean) {

            this._dirty = dirty;

            if (this.isInEditorArea()) {

                const folder = this.getPartFolder();
                const label = folder.getLabelFromContent(this);

                const iconClose = ColibriPlugin.getInstance().getIcon(colibri.ICON_CONTROL_CLOSE);
                const iconDirty = dirty ? ColibriPlugin.getInstance().getIcon(colibri.ICON_CONTROL_DIRTY) : iconClose;

                folder.setTabCloseIcons(label, iconDirty, iconClose);
            }

            this.eventDirtyStateChanged.fire(this._dirty);
        }

        isDirty() {

            return this._dirty;
        }

        async save() {

            if (this.isReadOnly()) {

                alert("Cannot save, the editor is in read-only mode.'");

                return;
            }

            await this.doSave();
        }

        protected async doSave() {
            // nothing
        }

        onPartClosed() {

            const ext = Platform.getWorkbench().getEditorInputExtension(this.getInput());

            if (this.isInEditorArea()) {

                if (ext) {

                    const id = ext.getEditorInputId(this.getInput());

                    const state = {};

                    this.saveState(state);

                    Platform.getWorkbench().getEditorSessionStateRegistry().set(id, state);
                }
            }

            if (this.isDirty()) {

                return confirm("This editor is not saved, do you want to close it?");
            }

            return true;
        }

        onPartAdded() {

            if (this.isInEditorArea()) {

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
        }

        getInput() {

            return this._input;
        }

        setInput(input: IEditorInput): void {

            this._input = input;
        }

        getEditorViewerProvider(key: string): EditorViewerProvider {

            const extensions = colibri.Platform.getExtensionRegistry()
                .getExtensions(EditorViewerProviderExtension.POINT_ID) as EditorViewerProviderExtension[];

            for (const ext of extensions) {

                const provider = ext.getEditorViewerProvider(this, key);

                if (provider) {

                    return provider;
                }
            }

            return null;
        }

        createEditorToolbar(parent: HTMLElement): controls.ToolbarManager {

            return null;
        }

        getEmbeddedEditorState(): any {
            return null;
        }

        restoreEmbeddedEditorState(state: any) {
            // nothing
        }
    }
}