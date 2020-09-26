/// <reference path="./MonacoEditor.ts" />
namespace phasereditor2d.code.ui.editors {

    export class XMLEditor extends MonacoEditor {

        static _factory: colibri.ui.ide.EditorFactory;

        static getFactory() {

            return this._factory

                || (this._factory = new colibri.ui.ide.ContentTypeEditorFactory("XML Editor",
                    webContentTypes.core.CONTENT_TYPE_XML, () => new XMLEditor()));
        }

        constructor() {
            super("phasereditor2d.core.ui.editors.XMLEditor", "xml", XMLEditor.getFactory());
        }

        async requestOutlineItems() {
            return [];
        }
    }
}