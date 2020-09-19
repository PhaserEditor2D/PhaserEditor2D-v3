namespace phasereditor2d.pack.core {

    export class AnimationConfigInPackItem {

        private _key: string;
        private _frames: AnimationFrameConfigInPackItem[];

        constructor() {

            this._frames = [];
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