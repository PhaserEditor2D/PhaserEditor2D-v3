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

        findAssetPackItem(key: string) {

            if (!key) {
                return null;
            }

            return this._packs
                .flatMap(pack => pack.getItems())
                .find(item => item.getKey() === key);
        }

        findPackItemOrFrameWithKey(key: string) {

            for (const pack of this._packs) {

                for (const item of pack.getItems()) {

                    if (item.getKey() === key) {
                        return item;
                    }

                    if (item instanceof ImageFrameContainerAssetPackItem) {

                        for (const frame of item.getFrames()) {

                            if (frame.getName() === key) {
                                return frame;
                            }
                        }
                    }
                }
            }

            return null;
        }

        getAssetPackItemOrFrame(key: string, frame: any) {

            const item = this.findAssetPackItem(key);

            if (!item) {
                return null;
            }

            if (item instanceof ImageAssetPackItem) {

                return item;

            } else if (item instanceof ImageFrameContainerAssetPackItem) {

                const imageFrame = item.findFrame(frame);

                return imageFrame;
            }

            return item;
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