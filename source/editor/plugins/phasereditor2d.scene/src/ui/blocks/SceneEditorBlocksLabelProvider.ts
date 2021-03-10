namespace phasereditor2d.scene.ui.blocks {

    import core = colibri.core;

    export class SceneEditorBlocksLabelProvider extends pack.ui.viewers.AssetPackLabelProvider {

        getLabel(obj: any) {

            if (obj instanceof core.io.FilePath && !obj.isFolder()) {

                return obj.getNameWithoutExtension();

            } else if (obj instanceof sceneobjects.SceneObjectExtension) {

                return obj.getTypeName();

            } else if (obj === sceneobjects.ObjectList) {

                return "List";

            } else if (obj instanceof viewers.PhaserTypeSymbol) {

                return obj.getDisplayName();
            }

            return super.getLabel(obj);
        }
    }
}