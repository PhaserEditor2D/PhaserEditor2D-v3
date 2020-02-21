namespace phasereditor2d.scene.ui.viewers {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class ObjectExtensionAndPrefabLabelProvider extends controls.viewers.LabelProvider {

        getLabel(obj: any) {

            if (obj instanceof io.FilePath) {

                return obj.getNameWithoutExtension();

            } else if (obj instanceof sceneobjects.SceneObjectExtension) {

                return obj.getTypeName();
            }

            return obj as string;
        }
    }
}