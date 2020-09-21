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

            const animation = finder.getPacks()

                .flatMap(pack => pack.getItems())

                .filter(item => item instanceof pack.core.AnimationsAssetPackItem)

                .flatMap((item: pack.core.AnimationsAssetPackItem) => item.getAnimations())

                .find(anim => anim.getKey() === value);

            if (animation) {

                const frames = animation.getFrames();

                if (frames.length > 0) {

                    const frame = frames[Math.floor(frames.length / 2)];

                    if (frame) {

                        return finder.getAssetPackItemImage(frame.getTextureKey(), frame.getFrameKey());
                    }
                }
            }

            return null;
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