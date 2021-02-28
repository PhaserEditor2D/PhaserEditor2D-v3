
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

                return new viewers.SceneFileCellRenderer();

            } else if (element instanceof sceneobjects.SceneObjectExtension) {

                return new viewers.ObjectExtensionCellRendererProvider().getCellRenderer(element);

            } else if (element === sceneobjects.ObjectList) {

                return new controls.viewers.IconImageCellRenderer(ScenePlugin.getInstance().getIcon(ICON_LIST));

            } else if (typeof (element) === "string" && BLOCKS_SECTIONS.indexOf(element) >= 0) {

                return new controls.viewers.IconImageCellRenderer(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));
            }

            return super.getCellRenderer(element);
        }

    }

}