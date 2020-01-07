/// <reference path="./Scene.ts" />

namespace phasereditor2d.scene.ui {

    export class OfflineScene extends Scene {

        static async createScene(data: core.json.SceneData) {

            const promise = new Promise<OfflineScene>((resolve, reject) => {

                const scene = new OfflineScene(data);

                scene.setCallback(() => {
                    resolve(scene);
                });

                const game = new Phaser.Game({
                    type: Phaser.HEADLESS,
                    width: 10,
                    height: 10,
                    audio: {
                        noAudio: true,
                    },
                    scene: scene,
                });
            });

            return promise;
        }

        private _data: core.json.SceneData;
        private _callback: () => void;

        private constructor(data: core.json.SceneData) {
            super(false);

            this._data = data;
        }

        setCallback(callback: () => void) {
            this._callback = callback;
        }

        async create() {

            const maker = this.getMaker();

            await maker.preload();

            await maker.updateSceneLoader(this._data);

            maker.createScene(this._data);

            this._callback();
        }
    }
}