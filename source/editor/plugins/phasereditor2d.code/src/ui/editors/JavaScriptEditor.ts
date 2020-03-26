/// <reference path="./MonacoEditor.ts" />
namespace phasereditor2d.code.ui.editors {

    import io = colibri.core.io;

    export class JavaScriptEditor extends MonacoEditor {

        static _factory: colibri.ui.ide.EditorFactory;

        static getFactory() {

            return this._factory

                || (this._factory = new colibri.ui.ide.ContentTypeEditorFactory(
                    webContentTypes.core.CONTENT_TYPE_JAVASCRIPT, () => new JavaScriptEditor()));
        }

        private _worker: monaco.languages.typescript.TypeScriptWorker;

        constructor() {
            super("phasereditor2d.core.ui.editors.JavaScriptEditor", "javascript");
        }

        protected async createModel(file: io.FilePath) {

            if (CodePlugin.getInstance().isAdvancedJSEditor()) {

                const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);

                const uri = monaco.Uri.file(file.getFullName());

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

            const uri = monaco.Uri.file(this.getInput().getFullName());

            this._model = monaco.editor.getModel(uri);

            const editor = this.getMonacoEditor();

            const state = editor.saveViewState();

            editor.setModel(this._model);

            editor.restoreViewState(state);
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

            if (!this._worker) {

                const getWorker = await monaco.languages.typescript.getJavaScriptWorker();

                this._worker = await getWorker();
            }

            const model = this.getMonacoEditor().getModel();

            if (model) {

                const items = await this._worker
                    .getNavigationBarItems(model.uri.toString());

                return items;
            }

            return [];
        }
    }
}