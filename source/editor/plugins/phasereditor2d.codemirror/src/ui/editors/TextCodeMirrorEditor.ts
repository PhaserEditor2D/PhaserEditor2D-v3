namespace phasereditor2d.codemirror.ui.editors {

    export class TextCodeMirrorEditor extends CodeMirrorEditor {

        static makeFactory(editorName: string, contentType: string, mode: string) {

            return new colibri.ui.ide.ContentTypeEditorFactory(editorName,
                contentType, factory => new TextCodeMirrorEditor("phasereditor2d.codemirror.ui.editors." + editorName, factory, mode))
        }

        constructor(id: string, factory: colibri.ui.ide.ContentTypeEditorFactory, mode: string) {
            super(id, factory, mode);
        }
    }
}