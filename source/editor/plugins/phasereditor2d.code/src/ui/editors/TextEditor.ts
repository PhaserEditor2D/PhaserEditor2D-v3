/// <reference path="./MonacoEditor.ts" />
namespace phasereditor2d.code.ui.editors {

    export class TextEditor extends MonacoEditor {

        static _factory: colibri.ui.ide.EditorFactory;

        static getFactory() {

            return this._factory

                || (this._factory = new colibri.ui.ide.ContentTypeEditorFactory("Text Editor",
                    webContentTypes.core.CONTENT_TYPE_TEXT, () => new TextEditor()));
        }

        constructor() {
            super("phasereditor2d.core.ui.editors.TextLEditor", "text", TextEditor.getFactory());
        }

        async requestOutlineItems() {
            return [];
        }
    }
}