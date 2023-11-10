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
                    contentType: core.CONTENT_TYPE_SCENE,
                    version: ui.Scene.CURRENT_VERSION
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

            for (const obj of this._scene.getGameObjects()) {

                this.computeDataField_private_np(obj);
            }

            for (const obj of this._scene.getGameObjects()) {

                const objData = {} as IObjectData;

                const objES = obj.getEditorSupport();

                // write the `private_np` field

                const private_np = objES._private_np;

                if (private_np) {

                    objData.private_np = true;
                }

                // serialize all the other obj data

                objES.writeJSON(objData);

                // add the data to the list

                sceneData.displayList.push(objData);
            }

            // prefab properties

            const prefabProperties = [];

            this._scene.getPrefabUserProperties().writeJSON(prefabProperties);

            if (prefabProperties.length > 0) {

                sceneData.prefabProperties = prefabProperties;
            }

            // code snippets

            const codeSnippets = this._scene.getCodeSnippets();

            if (codeSnippets.getSnippets().length > 0) {

                sceneData.codeSnippets = codeSnippets.toJSON();
            }

            return sceneData;
        }

        private computeDataField_private_np(obj: ui.sceneobjects.ISceneGameObject) {

            const objES = obj.getEditorSupport();

            for (const child of objES.getObjectChildren()) {

                this.computeDataField_private_np(child);
            }

            if (!objES.isPrefabInstancePart()
                && !objES.isNestedPrefabScope()
                && !objES.isScenePrefabObject()) {

                // ok, it is an object in the scene which
                // I don't know if it is a private nested prefab (`private_np`)
                // let's investigate with the kids

                for (const child of objES.getObjectChildren()) {

                    const childES = child.getEditorSupport();

                    if (
                        // the child is flagged as private_np
                        childES._private_np 
                        // or the child is is a common object with a NESTED_PREFAB scope
                        || (childES.isNestedPrefabScope() && !childES.isPrefabInstancePart())) {
                        
                        // flag the object and stop the search
                        objES._private_np = true;

                        break;
                    }
                }
            }
        }

        toString(): string {

            const json = this.toJSON();

            return JSON.stringify(json);
        }
    }
}