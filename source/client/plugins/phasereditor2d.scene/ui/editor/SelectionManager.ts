namespace phasereditor2d.scene.ui.editor {

    import controls = colibri.ui.controls;

    export class SelectionManager {

        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {

            this._editor = editor;

            this._editor.addEventListener(controls.EVENT_SELECTION_CHANGED, e => this.updateOutlineSelection());
        }

        getSelectionIds() {

            const list = [];

            list.push(...this._editor.getSelectedGameObjects()
                .map(obj => obj.getEditorSupport().getId()));

            list.push(...this._editor.getSelection()
                .filter(obj => obj instanceof sceneobjects.ObjectList)
                .map(obj => (obj as sceneobjects.ObjectList).getId()));

            return list;
        }

        setSelectionByIds(ids: string[]) {

            const map: Map<string, any> = new Map(
                this._editor.getScene().buildObjectIdMap());

            for (const list of this._editor.getScene().getObjectLists().getLists()) {

                map.set(list.getId(), list);
            }

            const sel = ids
                .map(id => map.get(id))
                .filter(obj => obj !== undefined);

            this._editor.setSelection(sel);
        }

        clearSelection() {

            this._editor.setSelection([]);
            this._editor.repaint();
        }

        refreshSelection() {

            this._editor.setSelection(this._editor.getSelection().filter(obj => {

                if (obj instanceof Phaser.GameObjects.GameObject) {
                    return this._editor.getScene().sys.displayList.exists(obj);
                }

                return true;
            }));
        }

        selectAll() {

            const sel = this._editor.getScene().getDisplayListChildren();
            this._editor.setSelection(sel);
            this._editor.repaint();
        }

        private updateOutlineSelection(): void {

            const provider = this._editor.getOutlineProvider();

            provider.setSelection(this._editor.getSelection(), true, true);
            provider.repaint();
        }

        onMouseClick(e: MouseEvent): void {

            const result = this.hitTestOfActivePointer();

            let next = [];

            if (result && result.length > 0) {

                const current = this._editor.getSelection();
                let selected = result.pop();

                if (selected) {

                    const obj = selected as sceneobjects.ISceneObject;

                    const owner = obj.getEditorSupport().getOwnerPrefabInstance();

                    selected = owner ?? selected;
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

        hitTestOfActivePointer(): Phaser.GameObjects.GameObject[] {
            const scene = this._editor.getScene();
            const input = scene.input;

            // const real = input["real_hitTest"];
            // const fake = input["hitTest"];

            // input["hitTest"] = real;

            const result = input.hitTestPointer(scene.input.activePointer);

            // input["hitTest"] = fake;

            return result;
        }
    }

}