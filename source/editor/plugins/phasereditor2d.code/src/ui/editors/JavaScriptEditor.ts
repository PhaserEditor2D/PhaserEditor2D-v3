/// <reference path="./MonacoEditor.ts" />
namespace phasereditor2d.code.ui.editors {

    export class JavaScriptEditor extends MonacoEditor {

        static _factory: colibri.ui.ide.EditorFactory;

        static getFactory() {

            return this._factory

                || (this._factory = new colibri.ui.ide.ContentTypeEditorFactory(
                    webContentTypes.core.CONTENT_TYPE_JAVASCRIPT, () => new JavaScriptEditor()));
        }

        private _worker: monaco.languages.typescript.TypeScriptWorker;

        constructor() {
            super("phasereditor2d.core.ui.editors.JavaScriptScriptEditor", "javascript");
        }

        async requestOutlineItems() {

            if (!this._worker) {

                const getWorker = await monaco.languages.typescript.getJavaScriptWorker();

                this._worker = await getWorker();
            }

            const items = await this._worker
                .getNavigationBarItems(this.getMonacoEditor().getModel().uri.toString());

            return items;
        }
    }
}