namespace phasereditor2d.code.ui.editors {

    export abstract class MonacoEditor extends colibri.ui.ide.FileEditor {

        private static _sharedEditorContainer: HTMLElement;
        private static _sharedEditor: monaco.editor.IStandaloneCodeEditor;

        protected _model: monaco.editor.ITextModel;
        private _language: string;
        private _outlineProvider: outline.MonacoEditorOutlineProvider;
        private _modelLines: number;
        private _viewState: monaco.editor.ICodeEditorViewState;
        private _modelDidChangeListener: monaco.IDisposable;

        constructor(id: string, language: string) {

            super(id);

            this.addClass("MonacoEditor");

            this._language = language;

            this._outlineProvider = new outline.MonacoEditorOutlineProvider(this);
        }

        getMonacoEditor() {
            return MonacoEditor._sharedEditor;
        }

        onPartClosed() {

            if (super.onPartClosed()) {

                if (this._model) {

                    this._viewState = MonacoEditor._sharedEditor.saveViewState();

                    this.disposeModel();
                }

                return true;
            }

            return false;
        }

        protected disposeModel() {

            this.removeModelListeners();

            this._model.dispose();

            this._model = null;
        }

        protected removeModelListeners() {

            if (this._modelDidChangeListener) {

                this._modelDidChangeListener.dispose();
            }
        }

        protected createPart(): void {

            if (!MonacoEditor._sharedEditorContainer) {

                const container = document.createElement("div");
                container.classList.add("MonacoEditorContainer");

                MonacoEditor._sharedEditorContainer = container;

                MonacoEditor._sharedEditor = monaco.editor.create(container, {
                    scrollBeyondLastLine: true,
                    fontSize: 16
                });
            }

            this.getElement().appendChild(MonacoEditor._sharedEditorContainer);

            this.updateContent();
        }

        onPartDeactivated() {

            super.onPartDeactivated();

            this._viewState = MonacoEditor._sharedEditor.saveViewState();
        }

        onPartActivated() {

            super.onPartActivated();

            if (MonacoEditor._sharedEditorContainer) {

                this.getElement().appendChild(MonacoEditor._sharedEditorContainer);

                const editor = MonacoEditor._sharedEditor;

                editor.setModel(this._model);

                if (this._viewState) {

                    editor.restoreViewState(this._viewState);
                }

                setTimeout(() => {

                    editor.focus();

                }, 1);
            }
        }

        private getTokensAtLine(position: monaco.IPosition) {

            const model = this._model;

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

        async doSave() {

            const content = this._model.getValue();

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

            const editor = MonacoEditor._sharedEditor;

            if (!editor) {
                return;
            }

            const before = editor.saveViewState();

            this._model = await this.createModel(file);

            editor.restoreViewState(before);

            this._modelDidChangeListener = this._model.onDidChangeContent(e => {
                this.setDirty(true);
            });

            MonacoEditor._sharedEditor.setModel(this._model);

            this.registerModelListeners(this._model);

            this.setDirty(false);

            this.refreshOutline();
        }

        protected async createModel(file: colibri.core.io.FilePath) {

            const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);

            const model = monaco.editor.createModel(content, this._language, monaco.Uri.file(file.getFullName()));

            return model;
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

            if (MonacoEditor._sharedEditor) {

                MonacoEditor._sharedEditor.layout();
            }
        }

        protected onEditorInputContentChanged() {

            // handled by the ModelManager.
        }
    }
}