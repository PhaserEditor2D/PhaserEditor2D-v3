namespace phasereditor2d.scene.ui.blocks {

    import io = colibri.core.io;
    import code = ide.core.code;

    export class SceneEditorBlocksStyledLabelProvider extends SceneEditorBlocksLabelProvider implements colibri.ui.controls.viewers.IStyledLabelProvider {

        private _scriptsLabelProvider = new sceneobjects.ScriptStyledLabelProvider();
        private _editor: editor.SceneEditor;

        constructor(editor: editor.SceneEditor) {
            super();
            this._editor = editor;
        }


        getStyledTexts(obj: any, dark: boolean): colibri.ui.controls.viewers.IStyledText[] {

            if (this._editor.getScene().isScriptNodePrefabScene()) {

                return this._scriptsLabelProvider.getStyledTexts(obj, dark);
            }

            const text = super.getLabel(obj);
            const isPrefab = obj instanceof colibri.core.io.FilePath
                && ScenePlugin.getInstance().getSceneFinder().isPrefabFile(obj);

            return [{
                text,
                color: isPrefab ? ScenePlugin.getInstance().getPrefabColor()
                    : colibri.ui.controls.Controls.getTheme().viewerForeground
            }];
        }
    }
}