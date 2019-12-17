namespace colibri.ui.ide {

    export abstract class EditorPart extends Part {

        private _input: any;
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

            const iconClose = controls.Controls.getIcon(controls.ICON_CONTROL_CLOSE);
            const iconDirty = dirty ? controls.Controls.getIcon(controls.ICON_CONTROL_DIRTY) : iconClose;

            folder.setTabCloseIcons(label, iconDirty, iconClose);
        }

        isDirty() {
            return this._dirty;
        }

        save() {
            this.doSave();
        }

        protected doSave() {

        }

        onPartClosed() {

            if (this.isDirty()) {
                return confirm("This editor is not saved, do you want to close it?");
            }

            return true;
        }

        getInput() {
            return this._input;
        }

        setInput(input: any): void {
            this._input = input;
        }

        getEditorViewerProvider(key: string): EditorViewerProvider {
            return null;
        }

        createEditorToolbar(parent : HTMLElement) : controls.ToolbarManager {
            return null;
        }
    }
}