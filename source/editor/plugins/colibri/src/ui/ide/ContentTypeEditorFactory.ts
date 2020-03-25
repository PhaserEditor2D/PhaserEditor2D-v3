/// <reference path="./EditorFactory.ts" />
namespace colibri.ui.ide {

    import io = colibri.core.io;

    export class ContentTypeEditorFactory extends EditorFactory {

        private _contentType: string;
        private _newEditor?: () => EditorPart;

        constructor(contentType: string, newEditor: () => EditorPart) {
            super();

            this._contentType = contentType;
            this._newEditor = newEditor;
        }

        acceptInput(input: any): boolean {

            if (input instanceof io.FilePath) {

                const contentType = colibri.Platform.getWorkbench()
                    .getContentTypeRegistry().getCachedContentType(input);

                return this._contentType === contentType;
            }

            return false;
        }

        createEditor() {
            return this._newEditor();
        }
    }
}