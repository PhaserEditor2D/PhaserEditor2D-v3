namespace phasereditor2d.pack.core.parsers {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class AssetPackCache {

        private _imageMap: Map<string, controls.IImage>;
        private _spriteSheetMap: Map<string, controls.IImage>;
        private _assets: Set<AssetPackItem>;

        constructor() {

            this._imageMap = new Map();

            this._spriteSheetMap = new Map();

            this._assets = new Set();
        }

        clear() {

            this._imageMap.clear();
            this._spriteSheetMap.clear();
        }

        addAsset(asset: AssetPackItem) {

            this._assets.add(asset);
        }

        findAsset(key: string) {

            for(const asset of this._assets) {

                if (asset.getKey() === key) {

                    return asset;
                }
            } 

            return null;
        }

        addImage(image: controls.IImage, key: string, frame?: string | number) {

            const mapKey = this.getImageMapKey(key, frame);

            this._imageMap.set(mapKey, image);
        }

        getImage(key: string, frame?: string | number) {

            const mapKey = this.getImageMapKey(key, frame);

            return this._imageMap.get(mapKey);
        }

        addSpritesheetImage(image: controls.IImage, key: string) {

            this._spriteSheetMap.set(key, image);
        }

        getSpritesheetImage(key: string) {

            return this._spriteSheetMap.get(key);
        }

        private getImageMapKey(key: string, frame: string | number) {

            return key + "$" + (frame === null || frame === undefined ? "." : frame);
        }

        buildAssetsDependenciesHash(builder: phasereditor2d.ide.core.MultiHashBuilder) {

            const files = new Set<io.FilePath>();

            for (const asset of this._assets) {

                files.add(asset.getPack().getFile());

                asset.computeUsedFiles(files);
            }

            for (const file of files) {

                builder.addPartialFileToken(file);
            }
        }
    }
}