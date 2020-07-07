namespace phasereditor2d.scene.ui.editor.usercomponent {

    interface ISnapshotData {
        selection: string[],
        model: IUserComponentsModelData
    }

    export class UserComponentsEditorSnapshotOperation extends colibri.ui.ide.undo.Operation {

        private _editor: UserComponentsEditor;
        private _before: ISnapshotData;
        private _after: ISnapshotData;

        constructor(editor: UserComponentsEditor, before: ISnapshotData, after: ISnapshotData) {
            super();

            this._editor = editor;
            this._before = before;
            this._after = after;
        }

        static takeSnapshot(editor: UserComponentsEditor): ISnapshotData {

            return {
                selection: editor.getSelectedComponents().map((userComp: UserComponent) => userComp.getName()),
                model: editor.getModel().toJSON()
            };
        }

        private loadSnapshot(data: ISnapshotData) {

            this._editor.getModel().readJSON(data.model);

            const sel = data.selection
                .map(name => this._editor.getModel().getComponents().find(userComp => userComp.getName() === name))
                .filter(userComp => userComp !== undefined);

            const viewer = this._editor.getViewer();

            viewer.setInput(this._editor.getModel().getComponents());

            viewer.setSelection(sel);
            viewer.reveal(...sel);

            this._editor.refreshViewers();

            this._editor.setDirty(true);
        }

        undo(): void {

            this.loadSnapshot(this._before);
        }

        redo(): void {

            this.loadSnapshot(this._after);
        }
    }
}