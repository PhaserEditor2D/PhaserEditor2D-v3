/// <reference path="./MonacoEditor.ts" />
namespace phasereditor2d.code.ui.editors {

    export class HTMLEditor extends MonacoEditor {

        static _factory: colibri.ui.ide.EditorFactory;

        static getFactory() {

            return this._factory

                || (this._factory = new colibri.ui.ide.ContentTypeEditorFactory("HTML Editor",
                    webContentTypes.core.CONTENT_TYPE_HTML, () => new HTMLEditor()));
        }

        constructor() {
            super("phasereditor2d.core.ui.editors.HTMLEditor", "html", HTMLEditor.getFactory());
        }

        async requestOutlineItems() {
            return [];
        }
    }
}