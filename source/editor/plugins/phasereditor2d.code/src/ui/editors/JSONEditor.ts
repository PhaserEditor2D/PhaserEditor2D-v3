/// <reference path="./MonacoEditor.ts" />
namespace phasereditor2d.code.ui.editors {

    export class JSONEditor extends MonacoEditor {

        static _factory: colibri.ui.ide.EditorFactory;

        static getFactory() {

            return this._factory

                || (this._factory = new colibri.ui.ide.ContentTypeEditorFactory("JSON Editor",
                    webContentTypes.core.CONTENT_TYPE_JSON, () => new JSONEditor()));
        }

        constructor() {
            super("phasereditor2d.core.ui.editors.JSONEditor", "json", JSONEditor.getFactory());
        }

        async requestOutlineItems() {
            return [];
        }
    }
}