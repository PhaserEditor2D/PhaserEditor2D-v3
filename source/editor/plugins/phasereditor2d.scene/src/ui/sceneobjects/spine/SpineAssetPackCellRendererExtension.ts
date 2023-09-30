namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineAssetPackCellRendererExtension extends pack.ui.AssetPackViewerExtension {

        acceptObject(obj: any): boolean {

            return obj instanceof pack.core.SpineSkinItem
                || obj instanceof pack.core.SpineAnimationItem;
        }

        getCellRenderer(obj: pack.core.SpineSkinItem | pack.core.SpineAnimationItem): colibri.ui.controls.viewers.ICellRenderer {

            if (obj instanceof pack.core.SpineSkinItem) {

                return new SpineSkinCellRenderer();
            }

            return new controls.viewers.IconImageCellRenderer(resources.getIcon(resources.ICON_SPINE));
        }

        getLabel(obj: pack.core.SpineSkinItem | pack.core.SpineAnimationItem): string {

            if (obj instanceof pack.core.SpineSkinItem) {

                return obj.skinName;
            }

            return obj.animationName;
        }
    }
}