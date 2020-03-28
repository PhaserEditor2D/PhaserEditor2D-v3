/// <reference path="./MonacoEditor.ts" />
namespace phasereditor2d.code.ui.editors {

    import io = colibri.core.io;

    export class JavaScriptEditor extends MonacoEditor {

        static _factory: colibri.ui.ide.EditorFactory;
        private _propertyProvider: properties.JavaScriptSectionProvider;

        static getFactory() {

            return this._factory

                || (this._factory = new colibri.ui.ide.ContentTypeEditorFactory(
                    webContentTypes.core.CONTENT_TYPE_JAVASCRIPT, () => new JavaScriptEditor()));
        }

        constructor() {
            super("phasereditor2d.core.ui.editors.JavaScriptEditor", "javascript");
        }

        protected async createModel(file: io.FilePath) {

            if (CodePlugin.getInstance().isAdvancedJSEditor()) {

                const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);

                const uri = CodePlugin.fileUri(file.getFullName());

                const model = monaco.editor.getModel(uri);

                if (content !== model.getValue()) {

                    model.setValue(content);
                }

                return model;

            } else {

                super.createModel(file);
            }
        }

        protected onEditorFileNameChanged() {

            const uri = CodePlugin.fileUri(this.getInput().getFullName());

            this._model = monaco.editor.getModel(uri);

            const editor = this.getMonacoEditor();

            const state = editor.saveViewState();

            editor.setModel(this._model);

            editor.restoreViewState(state);
        }

        getPropertyProvider() {

            if (!this._propertyProvider) {

                this._propertyProvider = new properties.JavaScriptSectionProvider();
            }

            return this._propertyProvider;
        }

        registerModelListeners(model: monaco.editor.ITextModel) {

            super.registerModelListeners(model);

            if (!CodePlugin.getInstance().isAdvancedJSEditor()) {

                return;
            }

            const editor = this.getMonacoEditor();

            editor.getDomNode().addEventListener("click", async (e) => {

                const worker = CodePlugin.getInstance().getJavaScriptWorker();

                const pos = editor.getPosition();

                const offs = editor.getModel().getOffsetAt(pos);

                const info = await worker.getQuickInfoAtPosition(CodePlugin.fileUri(this.getInput()).toString(), offs);

                if (info) {

                    this.setSelection([new properties.DocumentationItem(info)]);

                } else {

                    this.setSelection([]);
                }
            });
        }

        protected disposeModel() {

            if (CodePlugin.getInstance().isAdvancedJSEditor()) {

                // the model is disposed by the ModelsManager.
                // but we should update it with the file content if the editor is dirty

                if (this.isDirty()) {

                    console.log("update the model with the file content");

                    const content = colibri.ui.ide.FileUtils.getFileString(this.getInput());

                    const model = this.getMonacoEditor().getModel();

                    model.setValue(content);
                }

                this.removeModelListeners();

            } else {

                super.disposeModel();
            }
        }

        async requestOutlineItems() {

            if (CodePlugin.getInstance().isAdvancedJSEditor()) {

                const model = this.getMonacoEditor().getModel();

                if (model) {

                    const items = await CodePlugin.getInstance().getJavaScriptWorker()
                        .getNavigationBarItems(model.uri.toString());

                    return items.filter(i => i.text !== "<global>");
                }
            }

            return [];
        }
    }
}