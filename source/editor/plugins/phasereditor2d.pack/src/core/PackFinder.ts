namespace phasereditor2d.pack.core {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import core = colibri.core;
    import io = colibri.core.io;

    export class PackFinder {

        private _packs: AssetPack[];

        constructor(...packs: AssetPack[]) {

            this._packs = packs.filter(pack => pack !== null && pack !== undefined);
        }

        async preload(monitor?: controls.IProgressMonitor): Promise<controls.PreloadResult> {

            let result = controls.PreloadResult.NOTHING_LOADED;

            this._packs = await AssetPackUtils.getAllPacks();

            const items = this._packs.flatMap(pack => pack.getItems());

            for (const item of items) {

                const result2 = await item.preload();

                result = Math.max(result, result2);

                if (monitor) {

                    monitor.step();
                }
            }

            for (const item of items) {

                await item.build(this);
            }

            return Promise.resolve(result);
        }

        getPacks() {
            return this._packs;
        }

        getAssets(filter?: (item: AssetPackItem) => boolean) {

            return this.getPacks()

                .flatMap(p => p.getItems())

                .filter(i => !filter || filter(i));
        }

        findAnimationByKey(key: string) {

            return this.getAssets()

                .filter(i => i instanceof BaseAnimationsAssetPackItem)

                .flatMap((i: BaseAnimationsAssetPackItem) => i.getAnimations())

                .find(a => a.getKey() === key);
        }

        findAssetPackItem(key: string) {

            if (!key) {
                return null;
            }

            return this._packs
                .flatMap(pack => pack.getItems())
                .find(item => item.getKey() === key);
        }

        getAssetPackItemOrFrame(key: string, frame: any): ImageAssetPackItem | AssetPackImageFrame {

            const item = this.findAssetPackItem(key);

            if (!item) {

                return null;
            }

            if (item instanceof ImageAssetPackItem) {

                return item;

            } else if (item instanceof ImageFrameContainerAssetPackItem
                || item instanceof AsepriteAssetPackItem) {

                const imageFrame = item.findFrame(frame);

                return imageFrame;
            }

            if (item instanceof ImageAssetPackItem) {

                return item;
            }

            return null;
        }

        getAssetPackItemImage(key: string, frame: any): AssetPackImageFrame {

            const asset = this.getAssetPackItemOrFrame(key, frame);

            if (asset instanceof ImageAssetPackItem) {

                return asset.getFrames()[0];

            } else if (asset instanceof AssetPackImageFrame) {

                return asset;
            }

            return null;
        }

        async findPackItemsFor(file: core.io.FilePath): Promise<AssetPackItem[]> {

            const items = [];


            for (const pack of this.getPacks()) {

                for (const item of pack.getItems()) {

                    await item.preload();
                }

                for (const item of pack.getItems()) {

                    const files = new Set<io.FilePath>();

                    item.computeUsedFiles(files);

                    if (files.has(file)) {

                        items.push(item);
                    }
                }
            }

            return items;
        }
    }
}