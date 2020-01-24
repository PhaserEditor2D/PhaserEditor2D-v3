namespace phasereditor2d.scene.ui.viewers {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class ObjectExtensionAndPrefabLabelProvider extends controls.viewers.LabelProvider {

        getLabel(obj: any) {

            if (obj instanceof io.FilePath) {

                return obj.getNameWithoutExtension();
            }

            return (obj as sceneobjects.SceneObjectExtension).getTypeName();
        }
    }
}