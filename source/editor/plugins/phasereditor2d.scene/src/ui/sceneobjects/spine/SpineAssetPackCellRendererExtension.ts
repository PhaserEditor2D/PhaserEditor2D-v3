namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineAssetPackCellRendererExtension extends pack.ui.AssetPackViewerExtension {

        acceptObject(obj: any): boolean {

            return obj instanceof pack.core.SpineSkinItem;
        }

        getCellRenderer(obj: any): colibri.ui.controls.viewers.ICellRenderer {

            return new SpineSkinCellRenderer();
        }

        getLabel(obj: pack.core.SpineSkinItem): string {

            return obj.skinName;
        }
    }
}