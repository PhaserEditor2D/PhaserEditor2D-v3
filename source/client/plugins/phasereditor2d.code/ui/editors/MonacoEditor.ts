namespace phasereditor2d.code.ui.editors {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class MonacoEditorFactory extends colibri.ui.ide.EditorFactory {

        private _language: string;
        private _contentType: string;

        constructor(language: string, contentType: string) {
            super("phasereditor2d.core.ui.editors.MonacoEditorFactory#" + language);

            this._language = language;
            this._contentType = contentType;
        }

        acceptInput(input: any): boolean {

            if (input instanceof io.FilePath) {

                const contentType = colibri.Platform.getWorkbench().getContentTypeRegistry().getCachedContentType(input);

                return this._contentType === contentType;
            }

            return false;
        }

        createEditor(): colibri.ui.ide.EditorPart {
            return new MonacoEditor(this._language);
        }

    }

    export class MonacoEditor extends colibri.ui.ide.FileEditor {

        private static _factory: colibri.ui.ide.EditorFactory;

        private _monacoEditor: monaco.editor.IStandaloneCodeEditor;
        private _language: string;

        constructor(language: string) {

            super("phasereditor2d.core.ui.editors.JavaScriptEditor");

            this.addClass("MonacoEditor");

            this._language = language;
        }

        protected getMonacoEditor() {
            return this._monacoEditor;
        }

        onPartClosed() {

            if (this._monacoEditor) {

                this._monacoEditor.dispose();
            }

            return super.onPartClosed();
        }

        protected createPart(): void {

            const container = document.createElement("div");
            container.classList.add("MonacoEditorContainer");

            this.getElement().appendChild(container);

            this._monacoEditor = this.createMonacoEditor(container);

            this._monacoEditor.onDidChangeModelContent(e => {
                this.setDirty(true);
            });

            MonacoModelsManager.getInstance().start();

            this.updateContent();
        }

        private getTokensAtLine(position: monaco.IPosition) {

            const model = this._monacoEditor.getModel();

            const line = model.getLineContent(position.lineNumber);

            const tokens = monaco.editor.tokenize(line, this._language);

            let n = 0;

            let type = "unknown";

            for (const token of tokens[0]) {

                if (position.column >= token.offset) {
                    type = token.type;
                }
            }

            return type;

        }

        protected createMonacoEditor(container: HTMLElement) {

            return monaco.editor.create(container, this.createMonacoEditorOptions());
        }

        protected createMonacoEditorOptions(): monaco.editor.IEditorConstructionOptions {

            return {
                language: this._language,
                fontSize: 16,
                scrollBeyondLastLine: false
            };
        }

        async doSave() {

            const content = this._monacoEditor.getValue();

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

            const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);

            this._monacoEditor.setValue(content);

            this.setDirty(false);
        }

        layout() {

            super.layout();

            if (this._monacoEditor) {

                this._monacoEditor.layout();
            }
        }

        protected onEditorInputContentChanged() {

        }
    }
}