
namespace phasereditor2d.scene.ui {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import core = colibri.core;

    export class SceneMaker {

        private _scene: GameScene;

        constructor(scene: GameScene) {
            this._scene = scene;
        }

        createObject(objData: any) {

            const reader = new json.SceneParser(this._scene);

            return reader.createObject(objData);
        }

        createContainerWithObjects(objectList: sceneobjects.SceneObject[]): sceneobjects.Container {

            throw new Error("Not implemented yet. Needs revision!");

            // const container = sceneobjects.Container.add(this._scene, 0, 0, objectList);

            // const name = this._scene.makeNewName("container");

            // container.getEditorSupport().setLabel(name);

            // json.SceneParser.setNewId(container);

            // return container;
        }

        async createWithDropEvent_async(e: DragEvent, dropDataArray: any[]) {

            const exts = ScenePlugin.getInstance().getObjectExtensions();

            const nameMaker = new ide.utils.NameMaker(obj => {
                return (obj as sceneobjects.SceneObject).getEditorSupport().getLabel();
            });

            this._scene.visit(obj => nameMaker.update([obj]));

            const worldPoint = this._scene.getCamera().getWorldPoint(e.offsetX, e.offsetY);
            const x = worldPoint.x;
            const y = worldPoint.y;

            const parser = new json.SceneParser(this._scene);

            // TODO: we should do this with the extension
            for (const data of dropDataArray) {
                await parser.addToCache_async(data);
            }

            const sprites: sceneobjects.SceneObject[] = [];

            for (const data of dropDataArray) {

                for (const ext of exts) {

                    if (ext.acceptsDropData(data)) {

                        const sprite = ext.createSceneObjectWithAsset({
                            x: x,
                            y: y,
                            asset: data,
                            nameMaker: nameMaker,
                            scene: this._scene
                        });

                        sprites.push(sprite);
                    }
                }
            }

            for (const sprite of sprites) {

                sprite.getEditorSupport().setScene(this._scene);

                json.SceneParser.setNewId(sprite);
                json.SceneParser.initSprite(sprite);
            }

            return sprites;
        }
    }
}