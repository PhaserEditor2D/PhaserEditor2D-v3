namespace phasereditor2d.codemirror.ui.editors {

    import controls = colibri.ui.controls;

    export class CodeMirrorEditor extends colibri.ui.ide.FileEditor {

        private _codeEditor: CodeMirror.Editor;
        private _mode: string;
        private _themeListener: () => void;

        constructor(id: string, factory: colibri.ui.ide.EditorFactory, mode: string) {
            super(id, factory);

            this._mode = mode;
        }

        protected onEditorInputContentChangedByExternalEditor() {

            this.updateContent();
        }

        protected createPart(): void {

            this._codeEditor = CodeMirror(this.getElement(), {
                mode: this._mode,
                lineNumbers: true,
                showCursorWhenSelecting: true,
                tabSize: 4,
                indentWithTabs: true,
                autofocus: true,
                indentUnit: 4
            });

            this._codeEditor.setOption("styleActiveLine" as any, true);

            this._codeEditor.on("change", () => {

                this.setDirty(true);
            })

            this.updateEditorWithTheme();

            this.updateContent();

            this._themeListener = () => this.updateEditorWithTheme();

            colibri.Platform.getWorkbench().eventThemeChanged.addListener(this._themeListener);

        }

        private updateEditorWithTheme() {

            const theme = controls.Controls.getTheme();

            this._codeEditor.setOption("theme", theme.dark ? "darcula" : "default");
        }

        layout() {

            super.layout();

            if (this._codeEditor) {

                const element = this._codeEditor.getWrapperElement();

                const b = this.getElement().getBoundingClientRect();

                element.style.width = b.width + "px";
                element.style.height = b.height + "px";

                this._codeEditor.refresh();
            }
        }

        async doSave() {

            const content = this._codeEditor.getValue();

            try {

                await colibri.ui.ide.FileUtils.setFileString_async(this.getInput(), content);

                this.setDirty(false);

            } catch (e) {

                console.error(e);
            }
        }

        private async updateContent() {

            const file = this.getInput();

            if (!file) {

                return;
            }

            if (!this._codeEditor) {

                return;
            }

            const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);

            this._codeEditor.setValue(content);

            this.setDirty(false);
        }
    }
}