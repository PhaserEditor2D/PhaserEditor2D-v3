/// <reference path="./AbstractAssetKeyPropertyType.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class AnimationKeyPropertyType extends AbstractAssetKeyPropertyType {

        constructor() {
            super({
                id: "animation-key",
                name: "Animation Key",
                dialogTitle: "Select Animation Key",
                hasCustomIcon: true
            });
        }

        protected getIcon(finder: pack.core.PackFinder, value: string): controls.IImage {

            return AnimationKeyPropertyType.getAnimationIcon(finder, value);
        }

        static getAnimationIcon(finder: pack.core.PackFinder, value: string): controls.IImage {

            const animation = finder.getPacks()

                .flatMap(pack => pack.getItems())

                .filter(item => item instanceof pack.core.BaseAnimationsAssetPackItem)

                .flatMap((item: pack.core.BaseAnimationsAssetPackItem) => item.getAnimations())

                .find(anim => anim.getKey() === value);

            if (animation) {

                return animation.getPreviewImageAsset();
            }

            return null;
        }

        protected async createViewer() {

            const viewer = await super.createViewer();
            viewer.setCellSize(64, true);
            viewer.setContentProvider(new AnimationKeyContentProvider());

            return viewer;
        }

        createInspectorPropertyEditor(section: SceneGameObjectSection<any>, parent: HTMLElement, userProp: UserProperty, lockIcon: boolean): void {

            super.createInspectorPropertyEditor(section, parent, userProp, lockIcon, async () => {

                const finder = new pack.core.PackFinder();

                await finder.preload();

                const values = section.getSelection()
                    .map(o => userProp.getComponentProperty().getValue(o));

                const key = section.flatValues_StringOneOrNothing(
                    values);

                const anim = finder.findAnimationByKey(key);

                if (anim) {

                    const dlg = new AnimationPreviewDialog(anim.getParent(), {
                        key
                    });

                    dlg.create();

                } else {

                    alert("Animation key not found.");
                }
            });
        }

        createEditorElement(getValue: () => any, setValue: (value: any) => void): IPropertyEditor {

            return super.createEditorElement(getValue, setValue, async () => {

                const finder = new pack.core.PackFinder();

                await finder.preload();

                const key = getValue() as string;

                const anim = finder.findAnimationByKey(key);

                if (anim) {

                    const dlg = new AnimationPreviewDialog(anim.getParent(), {
                        key
                    });

                    dlg.create();

                } else {

                    alert("Animation key not found.");
                }
            });
        }
    }

    class AnimationKeyContentProvider implements controls.viewers.ITreeContentProvider {

        getRoots(input: any): any[] {

            const packs = input as pack.core.AssetPack[];

            return packs

                .flatMap(pack => pack.getItems())

                .filter(item => item instanceof pack.core.BaseAnimationsAssetPackItem)

                .flatMap((item: pack.core.BaseAnimationsAssetPackItem) => item.getAnimations());
        }

        getChildren(parent: any): any[] {

            return [];
        }
    }
}