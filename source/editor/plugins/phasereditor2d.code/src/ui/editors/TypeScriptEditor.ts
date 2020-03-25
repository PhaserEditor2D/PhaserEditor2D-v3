namespace phasereditor2d.code.ui.editors {

    export class TypeScriptEditor extends MonacoEditor {

        static _factory: colibri.ui.ide.EditorFactory;

        static getFactory() {

            return this._factory

                || (this._factory = new colibri.ui.ide.ContentTypeEditorFactory(
                    webContentTypes.core.CONTENT_TYPE_TYPESCRIPT, () => new TypeScriptEditor()));
        }

        private _worker: monaco.languages.typescript.TypeScriptWorker;

        constructor() {
            super("phasereditor2d.core.ui.editors.TypeScriptEditor", "typescript");
        }

        async requestOutlineItems() {

            if (!this._worker) {

                const getWorker = await monaco.languages.typescript.getTypeScriptWorker();

                this._worker = await getWorker();
            }

            const items = await this._worker
                .getNavigationBarItems(this.getMonacoEditor().getModel().uri.toString());

            return items;
        }

    }
}