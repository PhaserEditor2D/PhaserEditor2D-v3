namespace phasereditor2d.scene.ui.editor.undo {

    import json = core.json;
    import ISceneObject = sceneobjects.ISceneGameObject;

    export interface IObjectSnapshot {

        parentId: string;
        objData: json.IObjectData;
    }

    export interface ISnapshot {

        objects: IObjectSnapshot[];
    }

    export abstract class ObjectSnapshotOperation extends SceneEditorOperation {

        protected _before: ISnapshot;
        protected _after: ISnapshot;
        protected _objects: ISceneObject[];

        constructor(editor: SceneEditor, objects: ISceneObject[]) {
            super(editor);

            this._objects = objects;
        }

        protected abstract makeChangeSnapshot(input: ISceneObject[]): ISnapshot;

        async execute() {

            this._before = this.takeSnapshot(this._objects);

            this._after = this.makeChangeSnapshot(this._objects);

            this.loadSnapshot(this._after);
        }

        protected takeSnapshot(objects: ISceneObject[]) {

            const snapshot: ISnapshot = {
                objects: []
            };

            for (const obj of objects) {

                const data: json.IObjectData = {} as any;

                obj.getEditorSupport().writeJSON(data);

                let parentId: string;

                const parent = obj.getEditorSupport().getObjectParent();
                
                if (parent) {

                    parentId = parent.getEditorSupport().getId();
                }

                snapshot.objects.push({
                    parentId,
                    objData: data
                });
            }

            return snapshot;
        }

        private async loadSnapshot(snapshot: ISnapshot) {

            const scene = this.getScene();
            const maker = scene.getMaker();

            const selectionIds = this.getEditor().getSelectionManager().getSelectionIds();

            const finder = new pack.core.PackFinder();

            await finder.preload();

            await maker.updateSceneLoaderWithGameObjectDataList(finder,
                snapshot.objects.map(objSnapshot => objSnapshot.objData));

            for (const objSnapshot of snapshot.objects) {

                const oldObj = scene.getByEditorId(objSnapshot.objData.id);

                if (oldObj) {

                    const objData = objSnapshot.objData;

                    const newObj = maker.createObject(objData);

                    if (newObj) {

                        scene.removeGameObject(newObj);

                        if (objSnapshot.parentId) {

                            const parent = scene.getByEditorId(objSnapshot.parentId) as sceneobjects.Container | sceneobjects.Layer;

                            if (parent) {

                                parent.replace(oldObj, newObj);
                            }

                        } else {

                            scene.sys.displayList.replace(oldObj, newObj);
                        }
                    }

                    (oldObj as ISceneObject).getEditorSupport().destroy();
                }
            }

            await this.getEditor().refreshDependenciesHash();
            this._editor.setDirty(true);
            this._editor.getSelectionManager().setSelectionByIds(selectionIds);
        }

        undo(): void {

            this.loadSnapshot(this._before);
        }

        redo(): void {

            this.loadSnapshot(this._after);
        }
    }
}