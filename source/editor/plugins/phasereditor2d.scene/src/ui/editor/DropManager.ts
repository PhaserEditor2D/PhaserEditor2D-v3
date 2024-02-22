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

                await this.dropData(dataArray, e.offsetX, e.offsetY);
            }
        }

        async dropDataAtCenter(dataArray: any[]) {

            controls.Controls.setApplicationDragData(dataArray);

            const rect = this._editor.getElement().getClientRects().item(0);
            const offsetX = rect.width / 2;
            const offsetY = rect.height / 2;

            this.dropData(dataArray, offsetX, offsetY);
        }

        async dropData(dataArray: any[], offsetX: number, offsetY: number) {

            await this._editor.getUndoManager()
                .add(new undo.CreateObjectWithAssetOperation(this._editor, dataArray, offsetX, offsetY));

            await this._editor.refreshDependenciesHash();

            ide.Workbench.getWorkbench().setActivePart(this._editor);
        }

        async createWithDropEvent(
            dropAssetArray: any[], offsetX: number, offsetY: number,
            alternativeSelection?: sceneobjects.ISceneGameObject[]) {

            const scene = this._editor.getScene();

            const sceneMaker = scene.getMaker();

            const exts = ScenePlugin.getInstance().getGameObjectExtensions();

            const nameMaker = this.buildNameMaker();

            const worldPoint = scene.getCamera().getWorldPoint(offsetX, offsetY);
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
                        const spriteES = sprite.getEditorSupport();

                        if (spriteES.hasComponent(sceneobjects.TransformComponent)) {

                            spriteES.setUnlockedProperty(sceneobjects.TransformComponent.x, true);
                            spriteES.setUnlockedProperty(sceneobjects.TransformComponent.y, true);
                            (sprite as any as Phaser.GameObjects.Image).setPosition(x, y);
                        }

                        if (sprite) {

                            newSprites.push(sprite);
                        }

                        continue;
                    }
                }

                for (const ext of exts) {

                    if (ext.acceptsDropData(data)) {

                        const result = ext.createSceneObjectWithAsset({
                            x: x,
                            y: y,
                            asset: data,
                            scene: scene
                        });

                        // for compatibility with external plugins,
                        // I set returning a promise as optional
                        const sprite = result instanceof Promise ? await result : result;

                        if (sprite) {

                            newSprites.push(sprite);
                        }

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

                        const defaultObjects = this._editor.getSceneMaker()
                            .createDefaultObject(data, extraData, x, y);

                        for (const defaultObject of defaultObjects) {

                            if (sceneobjects.isGameObject(defaultObject)) {

                                newSprites.push(defaultObject as sceneobjects.ISceneGameObject);

                            } else {

                                scene.addPlainObject(defaultObject as sceneobjects.IScenePlainObject);

                                newPlainObjects.push(defaultObject as sceneobjects.IScenePlainObject);
                            }
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

                const sceneObjectES = sceneObject.getEditorSupport();

                let label = sceneObjectES.getLabel();

                if (sceneObjectES instanceof sceneobjects.GameObjectEditorSupport) {

                    label = sceneObjectES.isPrefabInstance() ? sceneObjectES.getPrefabName() : sceneObjectES.getLabel();
                }

                label = core.code.formatToValidVarName(label);

                label = nameMaker.makeName(label);

                sceneObjectES.setLabel(label);
            }

            scene.getMaker().afterDropObjects(prefabObj, newSprites, alternativeSelection);

            sceneobjects.sortGameObjects(newSprites);

            return [...newSprites, ...newPlainObjects, ...newLists];
        }

        private buildNameMaker() {

            const scene = this._editor.getScene();

            const nameMaker = new ide.utils.NameMaker(obj => {

                if (obj instanceof sceneobjects.ObjectList) {

                    return obj.getLabel();
                }

                return (obj as sceneobjects.ISceneObject).getEditorSupport().getLabel();
            });

            scene.visitAll(obj => nameMaker.update([obj]));

            nameMaker.update(scene.getPlainObjects());
            nameMaker.update(scene.getObjectLists().getLists());

            return nameMaker;
        }

        addFXObjects(factory: sceneobjects.FXObjectExtension|sceneobjects.IFXObjectFactory, ) {

            const nameMaker = this.buildNameMaker();

            const allParents = this._editor.getSelectedGameObjects()
                .filter(obj => obj.getEditorSupport().isDisplayObject() || obj instanceof sceneobjects.FXObject)
                .map(obj => obj instanceof sceneobjects.FXObject ? obj.getParent() : obj);

            const parents = new Set(allParents);

            const scene = this._editor.getScene();

            const op = new ui.editor.undo.SceneSnapshotOperation(this._editor, async () => {

                const fxList: sceneobjects.FXObject[] = [];

                for (const parent of parents) {

                    const isPreFX = sceneobjects.FXObjectExtension.isDefaultPipelinePreFX(parent);

                    const fx = factory.createFXObject(scene, parent, isPreFX);

                    parent.getEditorSupport().addObjectChild(fx);

                    const fxES = fx.getEditorSupport();

                    fxES.setLabel(nameMaker.makeName(fxES.getLabel() + "Fx"));

                    fxList.push(fx);
                }

                this._editor.setSelection(fxList);
            });

            this._editor.getUndoManager().add(op);
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