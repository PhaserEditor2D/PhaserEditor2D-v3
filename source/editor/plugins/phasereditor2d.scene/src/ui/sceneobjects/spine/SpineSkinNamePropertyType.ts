/// <reference path="../userProperties/AbstractDialogPropertyType.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineSkinNamePropertyType extends AbstractDialogPropertyType {

        constructor() {
            super({
                id: "spine-skin-name",
                name: "Spine Skin Name",
                dialogTitle: "Select Skin",
                hasCustomIcon: true
            });
        }

        protected async createViewer(): Promise<colibri.ui.controls.viewers.TreeViewer> {

            const viewer = new controls.viewers.TreeViewer("SpineSkinNamePropertyType");

            viewer.setLabelProvider(new SkinLabelProvider());
            viewer.setStyledLabelProvider(new SkinStyledCellLabelProvider());
            viewer.setCellRendererProvider(new pack.ui.viewers.AssetPackCellRendererProvider("tree"));
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setCellSize(64, true);

            return viewer;
        }

        protected valueToString(viewer: colibri.ui.controls.viewers.TreeViewer, value: pack.core.SpineSkinItem): string {

            return value.skinName;
        }

        protected async loadViewerInput(viewer: colibri.ui.controls.viewers.TreeViewer): Promise<void> {

            const input = await SpineUtils.getSpineSkinItems();

            viewer.setInput(input);
        }

        protected async updateIcon(iconControl: controls.IconControl, value: string): Promise<void> {

            const skinItems = await SpineUtils.getSpineSkinItems();

            const sameNameSkinItems = skinItems.filter(s => s.skinName === value);

            if (sameNameSkinItems.length === 1) {

                const [skinItem] = sameNameSkinItems;

                const img = SpineUtils.getSpineSkinItemImage(skinItem);

                if (img) {

                    await img.preload();
                }

                iconControl.setIcon(img);

            } else {

                iconControl.setIcon(resources.getIcon(resources.ICON_SPINE));
            }
        }
    }

    class SkinLabelProvider implements controls.viewers.ILabelProvider {

        getLabel(obj: pack.core.SpineSkinItem): string {

            return obj.skinName + " - " + obj.spineAsset.getKey();
        }
    }

    class SkinStyledCellLabelProvider implements controls.viewers.IStyledLabelProvider {

        getStyledTexts(obj: pack.core.SpineSkinItem, dark: boolean): controls.viewers.IStyledText[] {

            const theme = controls.Controls.getTheme();

            return [
                {
                    color: theme.viewerForeground,
                    text: obj.skinName
                },
                {
                    color: theme.viewerForeground + "90",
                    text: " - " + obj.spineAsset.getKey()
                }
            ];
        }
    }
}