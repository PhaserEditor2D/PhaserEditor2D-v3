namespace phasereditor2d.pack.core {

    export class AnimationConfigInPackItem {

        private _parent: BaseAnimationsAssetPackItem;
        private _key: string;
        private _frames: AnimationFrameConfigInPackItem[];

        constructor(parent: BaseAnimationsAssetPackItem) {

            this._parent = parent;
            this._frames = [];
        }

        getParent() {

            return this._parent;
        }

        getKey() {

            return this._key;
        }

        setKey(key: string) {

            this._key = key;
        }

        getFrames() {

            return this._frames;
        }

        getPreviewFrame() {

            if (this._frames.length > 0) {

                return this._frames[Math.floor(frames.length / 2)];
            }

            return null;
        }

        getPreviewImageAsset() {

            const frame = this.getPreviewFrame();

            if (frame) {

                return frame.getImageAsset();
            }

            return null;
        }
    }
}