namespace colibri.ui.ide {

    export abstract class OutlineProvider extends EventTarget {

        private _editor: EditorPart;

        constructor(editor: EditorPart) {
            super();
            this._editor = editor;
        }

        abstract getContentProvider(): controls.viewers.ITreeContentProvider;

        abstract getLabelProvider(): controls.viewers.ILabelProvider;

        abstract getCellRendererProvider(): controls.viewers.ICellRendererProvider;

        abstract getTreeViewerRenderer(viewer: controls.viewers.TreeViewer): controls.viewers.TreeViewerRenderer;
    }

}