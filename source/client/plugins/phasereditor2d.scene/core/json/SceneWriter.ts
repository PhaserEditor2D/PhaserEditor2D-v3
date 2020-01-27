namespace phasereditor2d.scene.core.json {

    export class SceneWriter {

        private _scene: ui.Scene;

        constructor(scene: ui.Scene) {
            this._scene = scene;
        }

        toJSON(): ISceneData {

            const sceneData: ISceneData = {
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

            this._scene.getObjectLists().writeJSON(sceneData);

            for (const obj of this._scene.getDisplayListChildren()) {

                const objData = {} as IObjectData;
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