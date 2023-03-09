namespace phasereditor2d.scene.ui.blocks {

    export class SceneEditorBlocksStyledLabelProvider extends SceneEditorBlocksLabelProvider implements colibri.ui.controls.viewers.IStyledLabelProvider {

        getStyledTexts(obj: any, dark: boolean): colibri.ui.controls.viewers.IStyledText[] {

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