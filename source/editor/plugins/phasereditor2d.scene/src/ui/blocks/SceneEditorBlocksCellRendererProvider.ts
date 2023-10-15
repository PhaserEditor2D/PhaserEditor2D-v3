
namespace phasereditor2d.scene.ui.blocks {

    import controls = colibri.ui.controls;

    export class SceneEditorBlocksCellRendererProvider extends pack.ui.viewers.AssetPackCellRendererProvider {

        constructor() {
            super("grid");
        }

        getCellRenderer(element: any) {

            if (SCENE_OBJECT_CATEGORY_SET.has(element)) {

                return new controls.viewers.IconImageCellRenderer(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));
            }

            if (element instanceof colibri.core.io.FilePath && ScenePlugin.getInstance().isSceneContentType(element)) {

                if (ScenePlugin.getInstance().getSceneFinder().isScriptPrefabFile(element)) {

                    return new colibri.ui.controls.viewers.IconGridCellRenderer(
                        resources.getIcon(resources.ICON_BUILD));
                }

                return new viewers.SceneFileCellRenderer();

            } else if (element instanceof sceneobjects.SceneObjectExtension) {

                return new viewers.ObjectExtensionCellRendererProvider().getCellRenderer(element);

            } else if (element === sceneobjects.ObjectList) {

                return new controls.viewers.IconImageCellRenderer(resources.getIcon(resources.ICON_LIST));

            } else if (typeof (element) === "string" && BLOCKS_SECTIONS.indexOf(element) >= 0) {

                return new controls.viewers.IconImageCellRenderer(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));

            } else if (element instanceof viewers.PhaserTypeSymbol) {

                return new controls.viewers.IconImageCellRenderer(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));

            } else if (element instanceof pack.core.AnimationConfigInPackItem) {

                return new pack.ui.viewers.AnimationConfigCellRenderer("square");
            }

            return super.getCellRenderer(element);
        }

    }

}