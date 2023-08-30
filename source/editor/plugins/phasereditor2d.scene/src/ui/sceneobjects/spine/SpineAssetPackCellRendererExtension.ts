namespace phasereditor2d.scene.ui.sceneobjects {

    export class SpineAssetPackCellRendererExtension extends pack.ui.AssetPackCellRendererExtension {

        acceptObject(obj: any): boolean {

            return obj instanceof pack.core.SpineSkinItem;
        }

        getCellRenderer(obj: any): colibri.ui.controls.viewers.ICellRenderer {

            return new SpineSkinCellRenderer();
        }

    }
}