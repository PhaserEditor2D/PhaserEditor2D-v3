namespace phasereditor2d.scene.ui.viewers {

    import controls = colibri.ui.controls;

    export class ObjectExtensionLabelProvider extends controls.viewers.LabelProvider {

        getLabel(ext: sceneobjects.SceneGameObjectExtension) {

            return ext.getTypeName();
        }
    }
}