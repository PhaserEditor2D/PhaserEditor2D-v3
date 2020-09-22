namespace phasereditor2d.scene.ui.blocks {

    import core = colibri.core;

    export class SceneEditorBlocksLabelProvider extends pack.ui.viewers.AssetPackLabelProvider {

        getLabel(obj: any) {

            if (obj instanceof core.io.FilePath) {

                return obj.getNameWithoutExtension();

            } else if (obj instanceof sceneobjects.SceneObjectExtension) {

                return obj.getTypeName();
            }

            return super.getLabel(obj);
        }
    }
}