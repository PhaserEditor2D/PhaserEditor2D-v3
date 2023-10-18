namespace phasereditor2d.scene.ui.editor.undo {

    export class DeleteOperation extends SceneSnapshotOperation {

        constructor(editor: SceneEditor) {
            super(editor);
        }

        protected async performModification() {

            const editor = this._editor;

            if (editor.getToolsManager().handleDeleteCommand()) {

                return;
            }

            const scene = this._editor.getScene();
            const lists = scene.getObjectLists();

            for (const obj of editor.getSelectedGameObjects()) {

                obj.getEditorSupport().destroy();

                lists.removeObjectById(obj.getEditorSupport().getId());
            }

            for (const obj of editor.getSelectedLists()) {

                lists.removeListById(obj.getId());
            }

            for(const obj of editor.getSelectedListItems()) {

                for(const list of lists.getLists()) {

                    list.removeItem(obj.getId());
                }
            }

            for(const obj of editor.getSelectedPrefabProperties()) {

                obj.getManager().deleteProperty(obj.getName());
            }

            scene.removePlainObjects(editor.getSelectedPlainObjects());

            const codeSnippetIds = editor.getSelectedCodeSnippets().map(s => s.getId());

            editor.getScene().getCodeSnippets().removeByIds(codeSnippetIds);

            const nodes = editor.getSelectedUserComponentNodes();

            for (const node of nodes) {

                node.getUserComponentsComponent()
                    .removeUserComponent(node.getComponentName());
            }

            editor.setSelection([]);
        }
    }
}