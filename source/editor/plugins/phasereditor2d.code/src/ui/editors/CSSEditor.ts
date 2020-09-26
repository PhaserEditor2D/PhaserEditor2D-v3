/// <reference path="./MonacoEditor.ts" />
namespace phasereditor2d.code.ui.editors {

    export class CSSEditor extends MonacoEditor {

        static _factory: colibri.ui.ide.EditorFactory;

        static getFactory() {

            return this._factory

                || (this._factory = new colibri.ui.ide.ContentTypeEditorFactory("CSS Editor",
                    webContentTypes.core.CONTENT_TYPE_CSS, () => new CSSEditor()));
        }

        constructor() {
            super("phasereditor2d.core.ui.editors.CSSEditor", "css", CSSEditor.getFactory());
        }

        async requestOutlineItems() {
            return [];
        }
    }
}