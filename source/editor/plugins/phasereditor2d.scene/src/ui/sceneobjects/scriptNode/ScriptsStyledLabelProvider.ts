namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    import code = ide.core.code;
    
    export class ScriptStyledLabelProvider implements controls.viewers.IStyledLabelProvider {

        getStyledTexts(obj: any, dark: boolean) {

            let text: string;
            let color: string;

            if (obj instanceof io.FilePath && obj.isFolder()) {

                if (code.isNodeLibraryFile(obj)) {

                    text = code.findNodeModuleName(obj);
                    color = ScenePlugin.getInstance().getScriptsLibraryColor();

                } else if (code.isCopiedLibraryFile(obj)) {

                    text = obj.getName();
                    color = ScenePlugin.getInstance().getScriptsLibraryColor();

                } else {

                    text = obj.getName();
                    color = controls.Controls.getTheme().viewerForeground;
                }

            } else if (obj instanceof ScriptNodeExtension) {

                text = obj.getTypeName();
                color = controls.Controls.getTheme().viewerForeground;

            } else {

                text = getSceneDisplayName(obj);
                color = ScenePlugin.getInstance().getPrefabColor();
            }

            return [{ text, color }];
        }
    }
}