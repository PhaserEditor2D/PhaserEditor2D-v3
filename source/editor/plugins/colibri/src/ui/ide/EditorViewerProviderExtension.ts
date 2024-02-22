namespace colibri.ui.ide {

    export abstract class EditorViewerProviderExtension extends Extension {

        static POINT_ID = "colibri.ui.ide.EditorViewerProviderExtension";

        abstract getEditorViewerProvider(editor: EditorPart, key: string): EditorViewerProvider | null;
    }
}