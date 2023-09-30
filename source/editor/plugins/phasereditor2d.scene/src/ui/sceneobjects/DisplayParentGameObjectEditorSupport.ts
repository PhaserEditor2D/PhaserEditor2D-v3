/// <reference path="./GameObjectEditorSupport.ts"/>
namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export abstract class DisplayParentGameObjectEditorSupport<T extends ISceneGameObject>
        extends GameObjectEditorSupport<T> {

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            if (this.isPrefabInstance() && !this.isNestedPrefabInstance()) {

                const finder = ScenePlugin.getInstance().getSceneFinder();

                const file = finder.getPrefabFile(this.getPrefabId());

                if (file) {

                    const image = SceneThumbnailCache.getInstance().getContent(file);

                    if (image) {

                        return new controls.viewers.ImageCellRenderer(image);
                    }
                }
            }

            return new controls.viewers.IconImageCellRenderer(resources.getIcon(resources.ICON_GROUP));
        }

        setInteractive() {
            // nothing
        }
    }
}