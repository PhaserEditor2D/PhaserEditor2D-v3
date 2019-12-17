/// <reference path="../viewers/AssetPackTreeViewerRenderer.ts" />

namespace phasereditor2d.pack.ui.editor {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class AssetPackEditorTreeViewerRenderer extends viewers.AssetPackTreeViewerRenderer {

        private _editor : AssetPackEditor;

        constructor(editor : AssetPackEditor, viewer : controls.viewers.TreeViewer) {
            super(viewer, false);

            this._editor  = editor;

            this.setSections([]);
        }

        isChild(file : io.FilePath) {
            
            const root = this._editor.getInput().getParent();

            return file.isFile() && file.getParent() !== root;
        }

        isParent(file : io.FilePath) {
            return file.isFolder();
        }
    }
}