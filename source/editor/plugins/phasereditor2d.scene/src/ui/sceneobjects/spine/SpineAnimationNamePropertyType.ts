/// <reference path="../userProperties/AbstractDialogPropertyType.ts" />
/// <reference path="./SpineSkinCellRenderer.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    function getSkin(obj: pack.core.SpineAnimationItem) {

        const skins = obj.spineAsset.getGuessSkinItems();

        const skin = skins[Math.floor(skins.length / 2)];

        return skin;
    }

    export class SpineAnimationNamePropertyType extends AbstractDialogPropertyType {

        constructor() {
            super({
                id: "spine-animation-name",
                name: "Spine Animation Name",
                dialogTitle: "Select Animation",
                hasCustomIcon: true
            });
        }

        protected async updateIcon(iconControl: controls.IconControl, value: string): Promise<void> {

            const animationItems = await SpineUtils.getSpineAnimationItems();

            const sameNameAnimationItems = animationItems.filter(i => i.animationName === value);

            if (sameNameAnimationItems.length === 1) {

                const [animationItem] = sameNameAnimationItems;

                const skin = getSkin(animationItem);

                if (skin) {

                    const img = SpineUtils.getSpineSkinItemImage(skin);

                    if (img) {

                        await img.preload();
                    }

                    iconControl.setIcon(img);

                    return;
                }
            }

            iconControl.setIcon(resources.getIcon(resources.ICON_SPINE));
        }

        protected async createViewer(): Promise<colibri.ui.controls.viewers.TreeViewer> {

            const viewer = new controls.viewers.TreeViewer("SpineAnimationNamePropertyType");

            viewer.setLabelProvider(new AnimationLabelProvider());
            viewer.setStyledLabelProvider(new AnimationStyledCellLabelProvider());
            viewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider(() => new AnimationCellRenderer()));
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setCellSize(64, true);

            return viewer;
        }

        protected valueToString(viewer: colibri.ui.controls.viewers.TreeViewer, value: pack.core.SpineAnimationItem): string {

            return value.animationName;
        }

        protected async loadViewerInput(viewer: colibri.ui.controls.viewers.TreeViewer): Promise<void> {

            const input = await SpineUtils.getSpineAnimationItems();

            viewer.setInput(input);
        }
    }

    class AnimationCellRenderer extends SpineSkinCellRenderer {

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const skin = getSkin(args.obj);

            if (skin) {

                const args2 = args.clone();
                args2.obj = skin;

                super.renderCell(args2);
            }
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            const skin = getSkin(args.obj)

            if (skin) {

                const args2 = args.clone();
                args2.obj = skin;

                return super.preload(args2);
            }

            return controls.PreloadResult.RESOURCES_LOADED;
        }
    }

    class AnimationLabelProvider implements controls.viewers.ILabelProvider {

        getLabel(obj: pack.core.SpineAnimationItem): string {

            return obj.animationName + " - " + obj.spineAsset.getKey();
        }
    }

    class AnimationStyledCellLabelProvider implements controls.viewers.IStyledLabelProvider {

        getStyledTexts(obj: pack.core.SpineAnimationItem, dark: boolean): controls.viewers.IStyledText[] {

            const theme = controls.Controls.getTheme();

            return [
                {
                    color: theme.viewerForeground,
                    text: obj.animationName
                },
                {
                    color: theme.viewerForeground + "90",
                    text: " - " + obj.spineAsset.getKey()
                }
            ];
        }
    }
}