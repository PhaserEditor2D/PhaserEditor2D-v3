namespace phasereditor2d.pack.core {

    export class AnimationConfigInPackItem {

        private _parent: AnimationsAssetPackItem;
        private _key: string;
        private _frames: AnimationFrameConfigInPackItem[];

        constructor(parent: AnimationsAssetPackItem) {

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
    }
}