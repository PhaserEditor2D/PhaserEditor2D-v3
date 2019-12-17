namespace phasereditor2d.pack.core {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import core = colibri.core;

    export class PackFinder {

        private _packs: AssetPack[];

        constructor(...packs: AssetPack[]) {
            this._packs = packs;
        }

        async preload(monitor: controls.IProgressMonitor = controls.EmptyProgressMonitor): Promise<controls.PreloadResult> {

            let result = controls.PreloadResult.NOTHING_LOADED;

            this._packs = await AssetPackUtils.getAllPacks();

            const items = this._packs.flatMap(pack => pack.getItems());

            monitor.addTotal(items.length);

            for (const item of items) {

                const result2 = await item.preload();
                result = Math.max(result, result2);

                monitor.step();
            }

            return Promise.resolve(result);
        }

        getPacks() {
            return this._packs;
        }

        findAssetPackItem(key: string) {
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

            let item = this.findAssetPackItem(key);

            if (!item) {
                return null;
            }

            if (item.getType() === IMAGE_TYPE) {

                if (frame === null || frame === undefined) {
                    return item;
                }

                return null;

            } else if (item instanceof ImageFrameContainerAssetPackItem) {

                const imageFrame = item.findFrame(frame);

                return imageFrame;
            }

            return item;
        }

        getAssetPackItemImage(key: string, frame: any): controls.IImage {

            const asset = this.getAssetPackItemOrFrame(key, frame);

            if (asset instanceof AssetPackItem && asset.getType() === IMAGE_TYPE) {

                return AssetPackUtils.getImageFromPackUrl(asset.getData().url);

            } else if (asset instanceof AssetPackImageFrame) {

                return asset;

            }

            return new controls.ImageWrapper(null);
        }

    }

}