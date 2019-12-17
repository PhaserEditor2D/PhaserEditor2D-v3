namespace phasereditor2d.scene.ui.json {

    export class SceneWriter {

        private _scene: GameScene;

        constructor(scene: GameScene) {
            this._scene = scene;
        }

        toJSON(): SceneData {

            const sceneData: SceneData = {
                sceneType: this._scene.getSceneType(),
                displayList: [],
                meta: {
                    app: "Phaser Editor 2D - Scene Editor",
                    url: "https://phasereditor2d.com",
                    contentType: core.CONTENT_TYPE_SCENE
                }
            };

            for (const obj of this._scene.getDisplayListChildren()) {

                const objData = {};
                obj.writeJSON(objData);
                sceneData.displayList.push(objData);
            }

            return sceneData;
        }


        toString() : string {

            const json = this.toJSON();

            return JSON.stringify(json);
        }

    }

}