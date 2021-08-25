/// <reference path="./MonacoEditor.ts" />
namespace phasereditor2d.code.ui.editors {

    import io = colibri.core.io;

    export class JavaScriptEditor extends MonacoEditor {

        static _jsFactory: colibri.ui.ide.EditorFactory;
        static _tsFactory: colibri.ui.ide.EditorFactory;
        private _propertyProvider: properties.JavaScriptSectionProvider;
        private _finder: pack.core.PackFinder;

        static getJavaScriptFactory() {

            return this._jsFactory

                || (this._jsFactory = new colibri.ui.ide.ContentTypeEditorFactory("JavaScript Editor",
                    webContentTypes.core.CONTENT_TYPE_JAVASCRIPT, () => new JavaScriptEditor("javascript")));
        }

        static getTypeScriptFactory() {

            return this._tsFactory

                || (this._tsFactory = new colibri.ui.ide.ContentTypeEditorFactory("TypeScript Editor",
                    webContentTypes.core.CONTENT_TYPE_TYPESCRIPT, () => new JavaScriptEditor("typescript")));
        }

        constructor(lang: "javascript" | "typescript") {
            super("phasereditor2d.core.ui.editors.JavaScriptEditor", lang,
                lang === "javascript" ? JavaScriptEditor.getJavaScriptFactory() : JavaScriptEditor.getTypeScriptFactory());

            this._finder = new pack.core.PackFinder();
        }

        protected async createModel(file: io.FilePath) {

            let model: monaco.editor.ITextModel;


            const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);

            const uri = CodePlugin.fileUri(file.getFullName());

            model = monaco.editor.getModel(uri);

            if (content !== model.getValue()) {

                model.setValue(content);
            }

            this._finder.preload();

            return model;
        }

        onPartActivated() {

            super.onPartActivated();

            this._finder.preload();
        }

        protected onEditorFileNameChanged() {

            const uri = CodePlugin.fileUri(this.getInput().getFullName());

            this._model = monaco.editor.getModel(uri);

            const editor = this.getMonacoEditor();

            const state = editor.saveViewState();

            editor.setModel(this._model);

            editor.restoreViewState(state);

            this.registerModelListeners(this._model);
        }

        getEmbeddedEditorState() {

            const editor = this.getMonacoEditor();

            if (editor) {

                return this.getMonacoEditor().saveViewState();
            }

            return null;
        }

        restoreEmbeddedEditorState(state: any) {

            const editor = this.getMonacoEditor();

            if (editor && state) {

                editor.restoreViewState(state);
            }
        }

        getPropertyProvider() {

            if (this.isInEditorArea()) {

                if (!this._propertyProvider) {

                    this._propertyProvider = new properties.JavaScriptSectionProvider();
                }
            }

            return this._propertyProvider;
        }

        registerModelListeners(model: monaco.editor.ITextModel) {

            super.registerModelListeners(model);

            const editor = this.getMonacoEditor();

            if (this.isInEditorArea()) {

                editor.getDomNode().addEventListener("click", async (e) => {

                    const pos = editor.getPosition();

                    const docItem = await this.getDocItemAtPosition(pos);

                    if (docItem) {

                        this.setSelection([docItem]);

                        return;
                    }

                    const item = await this.getAssetItemAtPosition(pos);

                    if (item) {

                        this.setSelection([item]);

                        return;
                    }

                    this.setSelection([]);

                });
            }
        }

        private async getAssetItemAtPosition(pos: monaco.IPosition) {

            const token = this.getTokenAt(pos);

            if (!token || token.type !== "string.js") {

                return null;
            }

            let str = token.value;

            // remove the ' or " or ` chars
            str = str.substring(1, str.length - 1);

            const obj = this._finder.findPackItemOrFrameWithKey(str);

            return obj;
        }

        private async getDocItemAtPosition(pos: monaco.IPosition) {

            const worker = await CodePlugin.getInstance().getJavaScriptWorker();

            const offs = this.getMonacoEditor().getModel().getOffsetAt(pos);

            const info = await worker.getQuickInfoAtPosition(CodePlugin.fileUri(this.getInput()).toString(), offs);

            if (info) {

                return new properties.DocumentationItem(info);

            }
        }

        protected disposeModel() {


            // the model is disposed by the ModelsManager.
            // but we should update it with the file content if the editor is dirty

            if (this.isDirty()) {

                const content = colibri.ui.ide.FileUtils.getFileString(this.getInput());

                const model = this.getMonacoEditor().getModel();

                model.setValue(content);
            }

            this.removeModelListeners();
        }

        async requestOutlineItems() {

            const model = this.getMonacoEditor().getModel();

            if (model) {

                const worker = await CodePlugin.getInstance().getJavaScriptWorker();
                const items = await worker.getNavigationBarItems(model.uri.toString());

                return items.filter(i => i.text !== "<global>");
            }

            return [];
        }
    }
}