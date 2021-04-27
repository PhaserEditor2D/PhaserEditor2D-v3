namespace phasereditor2d.scene.ui.editor {

    export class SelectionManager {

        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {

            this._editor = editor;

            this._editor.eventSelectionChanged.addListener(() => this.updateOutlineSelection());
        }

        getSelectionIds() {

            const list = [];

            list.push(...this._editor.getSelectedGameObjects()
                .map(obj => obj.getEditorSupport().getId()));

            list.push(...this._editor.getSelectedPlainObjects()
                .map(obj => obj.getEditorSupport().getId()))

            list.push(...this._editor.getSelection()
                .filter(obj => obj instanceof sceneobjects.ObjectList)
                .map(obj => (obj as sceneobjects.ObjectList).getId()));

            return list;
        }

        setSelectionByIds(selectionIds: string[]) {

            const scene = this._editor.getScene();

            const map: Map<string, any> = new Map(
                scene.buildObjectIdMap());

            for (const obj of scene.getPlainObjects()) {

                map.set(obj.getEditorSupport().getId(), obj);
            }

            for (const list of this._editor.getScene().getObjectLists().getLists()) {

                map.set(list.getId(), list);
            }

            const sel = selectionIds
                .map(id => map.get(id))
                .filter(obj => obj !== undefined);

            this._editor.setSelection(sel);
        }

        getState() {

            return this.getSelectionIds();
        }

        setState(state: string[]) {

            if (state) {

                this.setSelectionByIds(state);

            } else {

                this._editor.setSelection([]);
            }
        }

        clearSelection() {

            this._editor.setSelection([]);
            this._editor.repaint();
        }

        refreshSelection() {

            this._editor.setSelection(this._editor.getSelection()
                .map(obj => {

                    const objMap = this._editor.getScene().buildObjectIdMap();

                    if (sceneobjects.isGameObject(obj)) {

                        return objMap.get((obj as sceneobjects.ISceneGameObject).getEditorSupport().getId());
                    }

                    if (sceneobjects.ScenePlainObjectEditorSupport.hasEditorSupport(obj)) {

                        return this._editor.getScene().getPlainObjectById(
                            (obj as sceneobjects.IScenePlainObject).getEditorSupport().getId());
                    }

                    if (obj instanceof sceneobjects.ObjectList) {

                        return this._editor.getScene().getObjectLists().getListById(obj.getId());
                    }

                    return undefined;
                })
                .filter(obj => obj !== undefined && obj !== null)
            );
        }

        selectAll() {

            const sel = this._editor.getScene().getDisplayListChildren();
            this._editor.setSelection(sel);
            this._editor.repaint();
        }

        private updateOutlineSelection(): void {

            const provider = this._editor.getOutlineProvider();

            const sel = this._editor.getSelection();

            provider.setSelection(sel, true, true);

            provider.repaint();
        }

        onMouseClick(e: MouseEvent): void {

            const result = this.hitTestOfActivePointer();

            let next = [];

            if (result && result.length > 0) {

                const current = this._editor.getSelection();

                let selected = result[result.length - 1];

                if (selected) {

                    const obj = selected as sceneobjects.ISceneGameObject;

                    const owner = obj.getEditorSupport().getOwnerPrefabInstance();

                    selected = owner ?? selected;
                }

                if (selected) {

                    const objParent = sceneobjects.getObjectParent(selected);

                    if (objParent) {

                        if (!objParent.getEditorSupport().isAllowPickChildren()) {

                            selected = objParent;
                        }
                    }
                }

                if (e.ctrlKey || e.metaKey) {

                    if (new Set(current).has(selected)) {

                        next = current.filter(obj => obj !== selected);

                    } else {

                        next = current;
                        next.push(selected);
                    }

                } else if (selected) {

                    next = [selected];
                }
            }

            this._editor.setSelection(next);

            this._editor.repaint();
        }

        private hitTestOfActivePointer(): sceneobjects.ISceneGameObject[] {

            const scene = this._editor.getScene();

            const manager = scene.input.manager;

            const objects = scene.getInputSortedObjects();

            const result = manager.hitTest(scene.input.activePointer, objects, scene.getCamera());

            return result;
        }
    }
}