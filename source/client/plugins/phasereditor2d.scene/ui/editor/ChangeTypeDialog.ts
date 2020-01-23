namespace phasereditor2d.scene.ui.editor {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class ChangeTypeDialog extends controls.dialogs.ViewerDialog {

        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {
            super(new controls.viewers.TreeViewer());

            this._editor = editor;
        }

        static canMorph(editor: SceneEditor) {

            return this.getObjectsToMorph(editor).length > 0;
        }

        private static getObjectsToMorph(editor: SceneEditor) {

            return editor.getSelection().filter(obj => obj instanceof Phaser.GameObjects.GameObject);
        }

        create() {

            const viewer = this.getViewer();
            viewer.setLabelProvider(new controls.viewers.LabelProvider(obj => {

                if (obj instanceof io.FilePath) {

                    return obj.getNameWithoutExtension();
                }

                return (obj as sceneobjects.SceneObjectExtension).getTypeName();
            }));
            viewer.setCellRendererProvider(new viewers.TypeAndPrefabCellRendererProvider());
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setInput([
                ...ScenePlugin.getInstance().getObjectExtensions(),
                ...ScenePlugin.getInstance().getSceneFinder().getPrefabFiles()
            ]);

            super.create();

            this.setTitle("Change Type");

            const morphBtn = this.addOpenButton("Change", (sel: any[]) => {

                this.close();
            });

            this.enableButtonOnlyWhenSelectedOne(morphBtn);

            viewer.selectFirst();

            this.addButton("Cancel", () => this.close());
        }
    }
}