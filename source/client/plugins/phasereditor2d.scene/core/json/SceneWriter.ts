namespace phasereditor2d.scene.core.json {

    export class SceneWriter {

        private _scene: ui.GameScene;

        constructor(scene: ui.GameScene) {
            this._scene = scene;
        }

        toJSON(): SceneData {

            const sceneData: SceneData = {
                id: this._scene.getId(),
                sceneType: this._scene.getSceneType(),
                settings: this._scene.getSettings().toJSON(),
                displayList: [],
                meta: {
                    app: "Phaser Editor 2D - Scene Editor",
                    url: "https://phasereditor2d.com",
                    contentType: core.CONTENT_TYPE_SCENE
                }
            };

            for (const obj of this._scene.getDisplayListChildren()) {

                const objData = {} as ObjectData;
                obj.getEditorSupport().writeJSON(objData);
                sceneData.displayList.push(objData);
            }

            return sceneData;
        }

        toString(): string {

            const json = this.toJSON();

            return JSON.stringify(json);
        }
    }
}