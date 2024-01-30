/// <reference path="./Scene.ts" />

namespace phasereditor2d.scene.ui {

    export class OfflineScene extends Scene {

        static async createScene(data: core.json.ISceneData) {

            const promise = new Promise<OfflineScene>((resolve, reject) => {

                const scene = new OfflineScene(data);

                const canvasManager = ScenePlugin.getInstance().getCanvasManager();

                const canvas = canvasManager.takeCanvas();

                scene.setCallback(() => {
                    
                    resolve(scene);

                    canvasManager.releaseCanvas(canvas);
                });

                const game = new Phaser.Game({
                    type: Phaser.WEBGL,
                    canvas,
                    width: 1,
                    height: 1,
                    audio: {
                        noAudio: true,
                    },
                    physics: {
                        default: "arcade"
                    },
                    plugins: {
                        scene: [
                            { key: "spine.SpinePlugin", plugin: spine.SpinePlugin, mapping: "spine" }
                        ]
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

            ScenePlugin.getInstance().runSceneDataMigrations(this._data);

            this.registerDestroyListener("OfflineScene");

            const maker = this.getMaker();

            await maker.preload();

            await maker.updateSceneLoader(this._data);

            maker.createScene(this._data);

            this._callback();
        }
    }
}