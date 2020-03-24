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

                const contentType = colibri.Platform.getWorkbench()
                    .getContentTypeRegistry().getCachedContentType(input);

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
        private _outlineProvider: outline.MonacoEditorOutlineProvider;
        private _modelLines: number;

        constructor(language: string) {

            super("phasereditor2d.core.ui.editors.JavaScriptEditor");

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

                    this._monacoEditor.dispose();
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

                console.log("count " + count);

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

            await this._outlineProvider.requestOutlineElements();

            this._outlineProvider.repaint();
        }

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

class MonacoEditorViewerProvider extends colibri.ui.ide.EditorViewerProvider {

    getContentProvider(): colibri.ui.controls.viewers.ITreeContentProvider {
        throw new Error("Method not implemented.");
    }

    getLabelProvider(): colibri.ui.controls.viewers.ILabelProvider {
        throw new Error("Method not implemented.");
    }

    getCellRendererProvider(): colibri.ui.controls.viewers.ICellRendererProvider {
        throw new Error("Method not implemented.");
    }

    getTreeViewerRenderer(viewer: colibri.ui.controls.viewers.TreeViewer): colibri.ui.controls.viewers.TreeViewerRenderer {
        throw new Error("Method not implemented.");
    }

    getPropertySectionProvider(): colibri.ui.controls.properties.PropertySectionProvider {
        throw new Error("Method not implemented.");
    }

    getInput() {
        throw new Error("Method not implemented.");
    }

    preload(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getUndoManager() {
        throw new Error("Method not implemented.");
    }


}