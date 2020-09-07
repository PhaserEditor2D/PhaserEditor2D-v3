/// <reference path="./Scene.ts" />

namespace phasereditor2d.scene.ui {

    export class OfflineScene extends Scene {

        static async createScene(data: core.json.ISceneData) {

            const promise = new Promise<OfflineScene>((resolve, reject) => {

                const scene = new OfflineScene(data);

                scene.setCallback(() => {
                    resolve(scene);
                });

                const game = new Phaser.Game({
                    type: Phaser.CANVAS,
                    width: 1,
                    height: 1,
                    audio: {
                        noAudio: true,
                    },
                    scene: scene,
                });
            });

            return promise;
        }

        private _data: core.json.ISceneData;
        private _callback: () => void;

        private constructor(data: core.json.ISceneData) {
            super();

            this._data = data;
        }

        setCallback(callback: () => void) {
            this._callback = callback;
        }

        async create() {

            this.registerDestroyListener("OfflineScene");

            const maker = this.getMaker();

            await maker.preload();

            await maker.updateSceneLoader(this._data);

            maker.createScene(this._data);

            this._callback();
        }
    }
}