namespace phasereditor2d.scene.ui.editor.undo {

    import json = core.json;

    export interface ISceneSnapshot {

        selection: string[];
        displayList: json.IObjectData[];
        lists: json.IObjectListData[];
        plainObjects: json.IScenePlainObjectData[],
        prefabUserProperties: any[];
        codeSnippets: codesnippets.ICodeSnippetData[];
    }

    export class SceneSnapshotOperation extends SceneEditorOperation {

        private _before: ISceneSnapshot;
        private _after: ISceneSnapshot;
        private _operation: () => Promise<void>;

        constructor(editor: SceneEditor, operation?: () => Promise<void>) {
            super(editor);

            this._operation = operation;
        }

        async execute() {

            this._before = this.takeSnapshot();

            await this.performModification();

            this._after = this.takeSnapshot();

            this._editor.setDirty(true);
            this._editor.refreshOutline();
            this._editor.repaint();
            this._editor.dispatchSelectionChanged();
        }

        protected async performModification(): Promise<void> {

            if (this._operation) {

                await this._operation();
            }
        }

        private takeSnapshot(): ISceneSnapshot {

            const scene = this.getScene();

            return {

                displayList: scene.getGameObjects().map(obj => {

                    const data = {} as any;

                    obj.getEditorSupport().writeJSON(data);

                    return data as json.IObjectData;
                }),

                lists: scene.getObjectLists().getLists().map(list => {

                    const data = {} as any;

                    list.writeJSON(data);

                    return data as json.IObjectListData;

                }),

                plainObjects: scene.getPlainObjects().map(obj => {

                    const data = {} as json.IScenePlainObjectData;

                    obj.getEditorSupport().writeJSON(data);

                    return data;
                }),

                prefabUserProperties: scene.getPrefabUserProperties().toJSON(),

                codeSnippets: scene.getCodeSnippets().toJSON(),

                selection: this.getEditor().getSelectionManager().getSelectionIds(),
            };
        }

        protected loadSnapshot(snapshot: ISceneSnapshot) {

            const editor = this.getEditor();
            const scene = this.getScene();
            const maker = scene.getMaker();

            scene.removeAll();

            scene.readPlainObjects(snapshot.plainObjects);

            for (const data of snapshot.displayList) {

                maker.createObject(data);
            }

            scene.getObjectLists().readJSON_lists(snapshot.lists);

            scene.getCodeSnippets().readJSON(snapshot.codeSnippets);

            scene.getPrefabUserProperties().readJSON(snapshot.prefabUserProperties);

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