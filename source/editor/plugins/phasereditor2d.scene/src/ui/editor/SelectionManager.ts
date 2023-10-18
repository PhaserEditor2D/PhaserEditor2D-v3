namespace phasereditor2d.scene.ui.editor {

    export class SelectionManager {

        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {

            this._editor = editor;

            this._editor.eventSelectionChanged.addListener(() => this.updateOutlineSelection());
        }

        getSelectionIds() {

            const list: string[] = [];

            const selection = this._editor.getSelection();
            const selectedObjects = this._editor.getSelectedGameObjects();
            const selectedPlainObjects = this._editor.getSelectedPlainObjects();
            const selectedCodeSnippets = this._editor.getSelectedCodeSnippets();

            list.push(...selectedObjects
                .map(obj => obj.getEditorSupport().getId()));

            list.push(...selectedPlainObjects
                .map(obj => obj.getEditorSupport().getId()));

            list.push(...selectedCodeSnippets
                .map((s: codesnippets.CodeSnippet) => s.getId()));

            list.push(...selection
                .filter(obj => obj instanceof sceneobjects.ObjectList)
                .map(obj => (obj as sceneobjects.ObjectList).getId()));

            list.push(...selection
                .filter(obj => obj instanceof sceneobjects.ObjectListItem)
                .map(obj => (obj as sceneobjects.ObjectListItem).getId()));

            list.push(...selection
                .filter(i => i instanceof sceneobjects.UserComponentNode)
                .map((i: sceneobjects.UserComponentNode) => i.getId()));

            list.push(...selection
                .filter(obj => obj instanceof sceneobjects.UserProperty)
                .map((p: sceneobjects.UserProperty) => `prefabProperty#${p.getName()}`));

            return list;
        }

        setSelectionByIds(selectionIds: string[]) {

            const scene = this._editor.getScene();

            const objMap = scene.buildObjectIdMap();
            const userCompMap = scene.buildUserComponentIdMap();

            const map: Map<string, any> = new Map([...objMap, ...userCompMap] as Array<any>);

            for (const [k, v] of objMap) {
                map.set(k, v);
            }

            for (const [k, v] of objMap) {
                map.set(k, v);
            }

            for (const obj of scene.getPlainObjects()) {

                map.set(obj.getEditorSupport().getId(), obj);
            }

            for (const list of this._editor.getScene().getObjectLists().getLists()) {

                map.set(list.getId(), list);

                for (const item of list.getItems()) {

                    map.set(item.getId(), item);
                }
            }

            for (const prop of scene.getPrefabUserProperties().getProperties()) {

                map.set(`prefabProperty#${prop.getName()}`, prop);
            }

            for (const snippet of scene.getCodeSnippets().getSnippets()) {

                map.set(snippet.getId(), snippet);
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

                    const scene = this._editor.getScene();
                    const objMap = scene.buildObjectIdMap();

                    if (sceneobjects.isGameObject(obj)) {

                        return objMap.get((obj as sceneobjects.ISceneGameObject).getEditorSupport().getId());
                    }

                    if (sceneobjects.ScenePlainObjectEditorSupport.hasEditorSupport(obj)) {

                        return scene.getPlainObjectById(
                            (obj as sceneobjects.IScenePlainObject).getEditorSupport().getId());
                    }

                    if (obj instanceof sceneobjects.ObjectList) {

                        return scene.getObjectLists().getListById(obj.getId());
                    }

                    if (obj instanceof sceneobjects.UserProperty) {

                        return scene.getPrefabUserProperties().getProperties()
                            .find(p => p.getName() === obj.getName());
                    }

                    return undefined;
                })
                .filter(obj => obj !== undefined && obj !== null)
            );
        }

        selectAll() {

            const sel = this._editor.getScene().getGameObjects();
            this._editor.setSelection(sel);
            this._editor.repaint();
        }

        private updateOutlineSelection(): void {

            const provider = this._editor.getOutlineProvider();

            const sel = this._editor.getSelection();

            provider.setSelection(sel, true, true);

            provider.repaint();
        }

        private canPickObject(obj: sceneobjects.ISceneGameObject) {

            const objES = obj.getEditorSupport();

            if (objES.isPrefabInstanceElement()) {

                if (objES.isPrefeabInstanceAppendedChild() || objES.isMutableNestedPrefabInstance()) {

                    return true;
                }

                return false;
            }

            return this.parentsAllowPickingChildren(obj);
        }

        private parentsAllowPickingChildren(obj: sceneobjects.ISceneGameObject) {

            const parent = obj.getEditorSupport().getObjectParent();

            if (parent) {

                return parent.getEditorSupport().isAllowPickChildren() && this.canPickObject(parent);
            }

            return true;
        }

        private findPickableObject(obj: sceneobjects.ISceneGameObject) {

            const objES = obj.getEditorSupport();

            if (objES.isPrefabInstanceElement()) {

                if (objES.isMutableNestedPrefabInstance() || objES.isPrefeabInstanceAppendedChild()) {

                    if (this.parentsAllowPickingChildren(obj)) {

                        return obj;
                    }
                }

                const parent = obj.getEditorSupport().getObjectParent();

                return this.findPickableObject(parent);
            }

            return obj;
        }

        onMouseClick(e: MouseEvent): void {

            const result = this.hitTestOfActivePointer();

            let next = [];

            if (result && result.length > 0) {

                const current = this._editor.getSelection();

                let selected = result[result.length - 1];

                if (selected) {

                    selected = this.findPickableObject(selected);
                }

                if (selected) {

                    const objParent = selected.getEditorSupport().getObjectParent();

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