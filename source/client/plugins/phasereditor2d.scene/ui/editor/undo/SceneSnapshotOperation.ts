namespace phasereditor2d.scene.ui.editor.undo {

    import json = core.json;

    interface ISceneSnapshot {

        selection: string[];
        displayList: json.IObjectData[];
        lists: json.IObjectListData[];
    }

    export abstract class SceneSnapshotOperation extends SceneEditorOperation {

        private _before: ISceneSnapshot;
        private _after: ISceneSnapshot;

        constructor(editor: SceneEditor) {
            super(editor);
        }

        execute() {

            this._before = this.takeSnapshot();

            this.performModification();

            this._after = this.takeSnapshot();

            this._editor.setDirty(true);
            this._editor.refreshOutline();
        }

        protected abstract performModification();

        private takeSnapshot(): ISceneSnapshot {

            const scene = this.getScene();

            return {

                displayList: scene.getDisplayListChildren().map(obj => {

                    const data = {} as any;

                    obj.getEditorSupport().writeJSON(data);

                    return data as json.IObjectData;
                }),

                lists: scene.getObjectLists().getLists().map(list => {

                    const data = {} as any;

                    list.writeJSON(data);

                    return data as json.IObjectListData;

                }),

                selection: this.getEditor().getSelectionManager().getSelectionIds()
            };
        }

        private loadSnapshot(snapshot: ISceneSnapshot) {

            const editor = this.getEditor();
            const scene = this.getScene();
            const maker = scene.getMaker();

            scene.removeAll();

            for (const data of snapshot.displayList) {

                maker.createObject(data);
            }

            scene.getObjectLists().readJSON_lists(snapshot.lists);

            editor.setDirty(true);
            editor.repaint();
            editor.refreshOutline();
            editor.getSelectionManager().setSelectionByIds(snapshot.selection);
        }

        undo(): void {

            this.loadSnapshot(this._before);
        }

        redo(): void {

            this.loadSnapshot(this._after);
        }
    }
}