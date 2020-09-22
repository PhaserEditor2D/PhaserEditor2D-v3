
namespace phasereditor2d.scene.ui.blocks {

    import controls = colibri.ui.controls;

    export class SceneEditorBlocksCellRendererProvider extends pack.ui.viewers.AssetPackCellRendererProvider {

        constructor() {
            super("grid");

        }

        getCellRenderer(element: any) {

            if (element instanceof colibri.core.io.FilePath) {

                return new viewers.SceneFileCellRenderer();

            } else if (element instanceof sceneobjects.SceneObjectExtension) {

                return new viewers.ObjectExtensionCellRendererProvider().getCellRenderer(element);

            } else if (element === sceneobjects.ObjectList) {

                return new controls.viewers.IconImageCellRenderer(ScenePlugin.getInstance().getIcon(ICON_LIST));
            }

            return super.getCellRenderer(element);
        }

    }

}