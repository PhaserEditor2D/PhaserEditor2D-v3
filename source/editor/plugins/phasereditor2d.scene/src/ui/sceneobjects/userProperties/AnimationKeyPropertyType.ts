/// <reference path="./AssetKeyPropertyType.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class AnimationKeyPropertyType extends AssetKeyPropertyType {

        constructor() {
            super("animation-key");
        }

        getName() {

            return "Animation Key";
        }

        protected getDialogTitle() {

            return "Select Animation Key";
        }

        protected createViewer(finder: pack.core.PackFinder) {

            const viewer = super.createViewer(finder);

            viewer.setCellSize(64, true);

            viewer.setContentProvider(new AnimationKeyContentProvider());

            return viewer;
        }
    }

    class AnimationKeyContentProvider implements controls.viewers.ITreeContentProvider {

        getRoots(input: any): any[] {

            const packs = input as pack.core.AssetPack[];

            return packs

                .flatMap(pack => pack.getItems())

                .filter(item => item instanceof pack.core.AnimationsAssetPackItem)

                .flatMap((item: pack.core.AnimationsAssetPackItem) => item.getAnimations());
        }

        getChildren(parent: any): any[] {

            return [];
        }
    }
}