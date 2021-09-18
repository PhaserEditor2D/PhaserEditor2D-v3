namespace phasereditor2d.code.ui.editors {

    export interface IToken {
        type: string;
        value: string;
        start: number;
        end: number;
    }

    export abstract class MonacoEditor extends colibri.ui.ide.FileEditor {

        private _editor: monaco.editor.IStandaloneCodeEditor;
        protected _model: monaco.editor.ITextModel;
        private _language: string;
        private _outlineProvider: outline.MonacoEditorOutlineProvider;
        private _modelLines: number;
        private _onDidChangeContentEvent: monaco.IDisposable;
        private _onDidChangeCountEvent: monaco.IDisposable;

        constructor(id: string, language: string, editorFactory: colibri.ui.ide.EditorFactory) {
            super(id, editorFactory);

            this.addClass("MonacoEditor");

            this._language = language;

            this._outlineProvider = new outline.MonacoEditorOutlineProvider(this);
        }

        getMonacoEditor() {

            return this._editor;
        }

        getModel() {

            return this._model;
        }

        onPartClosed() {

            if (super.onPartClosed()) {

                if (this._model) {

                    this.disposeModel();
                }

                if (this._editor) {

                    this._editor.dispose();
                }

                return true;
            }

            return false;
        }

        onPartActivated() {

            setTimeout(() => {

                this._editor.focus();

            }, 10);
        }

        protected disposeModel() {

            this.removeModelListeners();

            this._model.dispose();

            this._model = null;
        }

        protected createPart(): void {

            const container = document.createElement("div");
            container.classList.add("MonacoEditorContainer");

            this._editor = monaco.editor.create(container, {
                scrollBeyondLastLine: true,
                fontSize: 16
            });

            // tslint:disable-next-line:no-bitwise
            this._editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_P, () => {

                const manager = colibri.Platform.getWorkbench().getCommandManager();
                manager.executeCommand(files.ui.actions.CMD_GO_TO_FILE);
            });

            this.getElement().appendChild(container);

            this.updateContent();
        }

        protected getTokenAt(pos: monaco.IPosition): IToken {

            const tokens = this.getTokensAt(pos);

            return tokens.find(t => pos.column >= t.start && pos.column <= t.end);
        }

        protected getTokensAt(pos: monaco.IPosition): IToken[] {

            const model = this._model;

            const line = model.getLineContent(pos.lineNumber);

            const result = monaco.editor.tokenize(line, this._language);

            if (result.length > 0) {

                const tokens = result[0];

                const tokens2: IToken[] = [];

                let lastOffset = -1;
                let lastType = null;

                for (const token of tokens) {

                    if (lastType) {

                        tokens2.push({
                            type: lastType,
                            value: line.substring(lastOffset, token.offset),
                            start: lastOffset,
                            end: token.offset
                        });

                    }

                    lastType = token.type;
                    lastOffset = token.offset;
                }

                if (lastType) {

                    tokens2.push({
                        type: lastType,
                        value: line.substring(lastOffset),
                        start: lastOffset,
                        end: line.length
                    });
                }

                return tokens2;
            }

            return [];
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

            if (!this._editor) {
                return;
            }

            this._model = await this.createModel(file);

            this._editor.setModel(this._model);

            this.registerModelListeners(this._model);

            this.setDirty(false);

            this.refreshOutline();
        }

        protected async createModel(file: colibri.core.io.FilePath) {

            const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);

            const model = monaco.editor.createModel(content, this._language);

            return model;
        }

        protected registerModelListeners(model: monaco.editor.ITextModel) {

            // dirty

            if (this._onDidChangeContentEvent) {

                this._onDidChangeContentEvent.dispose();
            }

            this._onDidChangeContentEvent = this._model.onDidChangeContent(async (e) => {

                const content = await colibri.ui.ide.FileUtils.getFileString(this.getInput());

                this.setDirty(content !== this._model.getValue());
            });

            if (this.isInEditorArea()) {

                // refresh outline

                if (this._onDidChangeCountEvent) {

                    this._onDidChangeCountEvent.dispose();
                }

                this._modelLines = model.getLineCount();

                this._onDidChangeCountEvent = model.onDidChangeContent(e => {

                    const count = model.getLineCount();

                    if (count !== this._modelLines) {

                        this.refreshOutline();

                        this._modelLines = count;
                    }
                });

                // reveal in outline

                this._editor.onDidChangeCursorPosition(e => {

                    const offset = this._model.getOffsetAt(e.position);

                    this._outlineProvider.revealOffset(offset);
                });
            }
        }

        protected removeModelListeners() {

            if (this._onDidChangeContentEvent) {

                this._onDidChangeContentEvent.dispose();
            }

            if (this._onDidChangeCountEvent) {

                this._onDidChangeCountEvent.dispose();
            }
        }

        getEditorViewerProvider(key: string) {

            switch (key) {

                case phasereditor2d.outline.ui.views.OutlineView.EDITOR_VIEWER_PROVIDER_KEY:

                    if (this.isInEditorArea()) {

                        return this._outlineProvider;
                    }

                    break;
            }

            return null;
        }

        async refreshOutline() {

            if (this.isInEditorArea()) {

                await this._outlineProvider.refresh();
            }
        }

        abstract requestOutlineItems(): Promise<any[]>;

        layout() {

            super.layout();

            if (this._editor) {

                this._editor.layout();
            }
        }

        protected async onEditorInputContentChangedByExternalEditor() {

            if (ModelManager.handleFileName(this.getInput().getName())) {
                // do nothing, the model manager will handle this!
                return;
            }

            const model = this.getModel();

            if (model) {

                const str = await colibri.ui.ide.FileUtils.preloadAndGetFileString(this.getInput());

                model.setValue(str);
            }
        }
    }
}