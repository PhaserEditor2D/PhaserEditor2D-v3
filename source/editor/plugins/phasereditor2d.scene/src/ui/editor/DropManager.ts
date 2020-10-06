namespace phasereditor2d.scene.ui.editor {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import io = colibri.core.io;

    export class DropManager {

        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {

            this._editor = editor;

            const canvas = this._editor.getOverlayLayer().getCanvas();
            canvas.addEventListener("dragover", e => this.onDragOver(e));
            canvas.addEventListener("drop", e => this.onDragDrop_async(e));
        }

        async onDragDrop_async(e: DragEvent) {

            const dataArray = controls.Controls.getApplicationDragDataAndClean();

            for (const data of dataArray) {

                if (data instanceof io.FilePath) {

                    if (data.getExtension() !== "scene") {

                        alert("<p>Only items shown in the Blocks view can be added to the scene.</p>" +
                            "<p>The Blocks view shows Scene Prefabs and items defined in the Asset Pack files.</p>" +
                            "<p>You can add files to a Pack File using the Inspector view or opening a pack file in the Asset Pack editor.</p>");

                        return;
                    }
                }
            }

            if (this.acceptDropDataArray(dataArray)) {

                e.preventDefault();

                await this._editor.getUndoManager()
                    .add(new undo.CreateObjectWithAssetOperation(this._editor, e, dataArray));

                await this._editor.refreshDependenciesHash();

                ide.Workbench.getWorkbench().setActivePart(this._editor);
            }
        }

        async createWithDropEvent(e: DragEvent, dropAssetArray: any[]) {

            const scene = this._editor.getScene();

            const sceneMaker = scene.getMaker();

            const exts = ScenePlugin.getInstance().getGameObjectExtensions();

            const nameMaker = new ide.utils.NameMaker(obj => {

                if (obj instanceof sceneobjects.ObjectList) {

                    return obj.getLabel();
                }

                return (obj as sceneobjects.ISceneObject).getEditorSupport().getLabel();
            });

            scene.visit(obj => nameMaker.update([obj]));
            nameMaker.update(scene.getPlainObjects());
            nameMaker.update(scene.getObjectLists().getLists());

            const worldPoint = scene.getCamera().getWorldPoint(e.offsetX, e.offsetY);
            const x = Math.floor(worldPoint.x);
            const y = Math.floor(worldPoint.y);

            const sceneFinder = ScenePlugin.getInstance().getSceneFinder();

            for (const data of dropAssetArray) {

                if (data instanceof io.FilePath) {

                    const file = data;

                    if (sceneMaker.isPrefabFile(file)) {

                        const sceneData = sceneFinder.getSceneData(file);

                        if (sceneData) {

                            await sceneMaker.updateSceneLoader(sceneData);
                        }
                    }
                }
            }

            for (const data of dropAssetArray) {

                const ext = ScenePlugin.getInstance().getLoaderUpdaterForAsset(data);

                if (ext) {

                    await ext.updateLoader(scene, data);
                }
            }

            const prefabObj = scene.getPrefabObject();

            const newSprites: sceneobjects.ISceneGameObject[] = [];
            const newLists = [];
            const newPlainObjects: sceneobjects.IScenePlainObject[] = [];

            for (const data of dropAssetArray) {

                if (data instanceof io.FilePath) {

                    if (sceneMaker.isPrefabFile(data)) {

                        const sprite = await sceneMaker.createPrefabInstanceWithFile(data);

                        const transformComp = sprite.getEditorSupport()
                            .getComponent(sceneobjects.TransformComponent) as sceneobjects.TransformComponent;

                        if (transformComp) {

                            const obj = transformComp.getObject();
                            obj.x = x;
                            obj.y = y;
                        }

                        if (sprite) {

                            newSprites.push(sprite);
                        }

                        continue;
                    }
                }

                for (const ext of exts) {

                    if (ext.acceptsDropData(data)) {

                        const sprite = ext.createSceneObjectWithAsset({
                            x: x,
                            y: y,
                            asset: data,
                            scene: scene
                        });

                        newSprites.push(sprite);

                        break;
                    }
                }

                if (data instanceof sceneobjects.SceneObjectExtension) {

                    let extraData: any;

                    if (data instanceof sceneobjects.SceneObjectExtension) {

                        const result = await data.collectExtraDataForCreateDefaultObject(this._editor);

                        if (result.abort) {

                            continue;
                        }

                        if (result.dataNotFoundMessage) {

                            alert(result.dataNotFoundMessage);

                            continue;
                        }

                        extraData = result.data;

                        const defaultObject = this._editor.getSceneMaker()
                            .createDefaultObject(data, extraData, x, y);

                        if (defaultObject instanceof Phaser.GameObjects.GameObject) {

                            newSprites.push(defaultObject);

                        } else {

                            scene.addPlainObject(defaultObject);

                            newPlainObjects.push(defaultObject);
                        }
                    }

                } else if (data === sceneobjects.ObjectList) {

                    const list = new sceneobjects.ObjectList();

                    list.setLabel(nameMaker.makeName("list"));

                    scene.getObjectLists().getLists().push(list);

                    newLists.push(list);
                }
            }

            for (const sceneObject of [...newSprites, ...newPlainObjects]) {

                const support = sceneObject.getEditorSupport();

                let label = support.getLabel();

                if (support instanceof sceneobjects.GameObjectEditorSupport) {

                    label = support.isPrefabInstance() ? support.getPrefabName() : support.getLabel();

                }

                label = core.code.formatToValidVarName(label);

                label = nameMaker.makeName(label);

                support.setLabel(label);
            }

            scene.getMaker().afterDropObjects(prefabObj, newSprites);

            return [...newSprites, ...newPlainObjects, ...newLists];
        }

        private onDragOver(e: DragEvent) {

            const dataArray = controls.Controls.getApplicationDragData();

            // accept any kind of file, so we can show a message when the drop is done.
            for (const data of dataArray) {

                if (data instanceof io.FilePath) {

                    e.preventDefault();

                    return;
                }
            }

            if (this.acceptDropDataArray(dataArray)) {

                e.preventDefault();
            }
        }

        private acceptDropData(data: any): boolean {

            if (data instanceof io.FilePath) {

                return SceneMaker.acceptDropFile(data, this._editor.getInput());
            }

            for (const ext of ScenePlugin.getInstance().getGameObjectExtensions()) {

                if (ext.acceptsDropData(data)) {
                    return true;
                }
            }

            if (data instanceof sceneobjects.SceneObjectExtension) {

                return true;
            }

            if (data === sceneobjects.ObjectList) {

                return true;
            }

            return false;
        }

        private acceptDropDataArray(dataArray: any[]) {

            if (this._editor.isLoading()) {

                return false;
            }

            if (!dataArray) {

                return false;
            }

            for (const item of dataArray) {

                if (!this.acceptDropData(item)) {
                    return false;
                }
            }

            return true;
        }
    }
}