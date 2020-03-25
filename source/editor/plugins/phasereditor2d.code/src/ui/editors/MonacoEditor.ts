namespace phasereditor2d.code.ui.editors {

    export abstract class MonacoEditor extends colibri.ui.ide.FileEditor {

        private _monacoEditor: monaco.editor.IStandaloneCodeEditor;
        private _language: string;
        private _outlineProvider: outline.MonacoEditorOutlineProvider;
        private _modelLines: number;

        constructor(id: string, language: string) {

            super(id);

            this.addClass("MonacoEditor");

            this._language = language;

            this._outlineProvider = new outline.MonacoEditorOutlineProvider(this);
        }

        getMonacoEditor() {
            return this._monacoEditor;
        }

        onPartClosed() {

            if (super.onPartClosed()) {

                if (this._monacoEditor) {

                    const model = this._monacoEditor.getModel();

                    this._monacoEditor.dispose();

                    model.dispose();
                }

                return true;
            }

            return false;
        }

        protected createPart(): void {

            const container = document.createElement("div");
            container.classList.add("MonacoEditorContainer");

            this.getElement().appendChild(container);

            this._monacoEditor = this.createMonacoEditor(container);

            this._monacoEditor.onDidChangeModelContent(e => {
                this.setDirty(true);
            });

            this.updateContent();
        }

        private getTokensAtLine(position: monaco.IPosition) {

            const model = this._monacoEditor.getModel();

            const line = model.getLineContent(position.lineNumber);

            const tokens = monaco.editor.tokenize(line, this._language);

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

        protected createMonacoEditorOptions(): monaco.editor.IStandaloneEditorConstructionOptions {

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

                this.refreshOutline();

            } catch (e) {

                console.error(e);
            }
        }

        private async updateContent() {

            const file = this.getInput();

            if (!file) {
                return;
            }

            if (!this._monacoEditor) {
                return;
            }

            const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);

            const model = monaco.editor.createModel(content, this._language, monaco.Uri.file(file.getFullName()));

            this._monacoEditor.setModel(model);

            this.registerModelListeners(model);

            this.setDirty(false);

            this.refreshOutline();
        }

        private registerModelListeners(model: monaco.editor.ITextModel) {

            this._modelLines = model.getLineCount();

            model.onDidChangeContent(e => {

                const count = model.getLineCount();

                if (count !== this._modelLines) {

                    this.refreshOutline();

                    this._modelLines = count;
                }
            });
        }

        getEditorViewerProvider(key: string) {

            switch (key) {

                case phasereditor2d.outline.ui.views.OutlineView.EDITOR_VIEWER_PROVIDER_KEY:

                    return this._outlineProvider;
            }

            return null;
        }

        async refreshOutline() {

            await this._outlineProvider.refresh();
        }

        abstract async requestOutlineItems(): Promise<any[]>;

        layout() {

            super.layout();

            if (this._monacoEditor) {

                this._monacoEditor.layout();
            }
        }

        protected onEditorInputContentChanged() {

            this.updateContent();
        }
    }
}