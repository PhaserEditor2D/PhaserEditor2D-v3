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
                plainObjects: [],
                meta: {
                    app: "Phaser Editor 2D - Scene Editor",
                    url: "https://phasereditor2d.com",
                    contentType: core.CONTENT_TYPE_SCENE
                }
            };

            // object lists

            this._scene.getObjectLists().writeJSON(sceneData);

            // plain objects

            for (const obj of this._scene.getPlainObjects()) {

                const objData = {} as IScenePlainObjectData;

                obj.getEditorSupport().writeJSON(objData);

                sceneData.plainObjects.push(objData);
            }

            // display list

            for (const obj of this._scene.getDisplayListChildren()) {

                const objData = {} as IObjectData;
                obj.getEditorSupport().writeJSON(objData);
                sceneData.displayList.push(objData);
            }

            // prefab properties

            const prefabProperties = [];

            this._scene.getPrefabUserProperties().writeJSON(prefabProperties);

            if (prefabProperties.length > 0) {

                sceneData.prefabProperties = prefabProperties;
            }

            return sceneData;
        }

        toString(): string {

            const json = this.toJSON();

            return JSON.stringify(json);
        }
    }
}