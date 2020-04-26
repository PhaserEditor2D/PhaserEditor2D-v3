namespace phasereditor2d.scene.ui.editor {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class ConvertTypeDialog extends controls.dialogs.ViewerDialog {

        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {
            super(new viewers.ObjectExtensionAndPrefabViewer());

            this._editor = editor;

            const size = this.getSize();
            this.setSize(size.width, size.height * 1.5);
        }

        static canConvert(editor: SceneEditor) {

            return this.getObjectsToMorph(editor).length > 0;
        }

        private static getObjectsToMorph(editor: SceneEditor) {

            return editor.getSelection().filter(obj => obj instanceof Phaser.GameObjects.GameObject);
        }

        create() {

            const viewer = this.getViewer();

            super.create();

            this.setTitle("Replace Type");

            this.enableButtonOnlyWhenOneElementIsSelected(
                this.addOpenButton("Replace", async (sel: any[]) => {

                    const targetType = viewer.getSelectionFirstElement();

                    let extraData: any = null;

                    if (targetType instanceof sceneobjects.SceneObjectExtension) {

                        const result = await targetType.collectExtraDataForCreateEmptyObject();

                        if (result.abort) {

                            return;
                        }

                        if (result.dataNotFoundMessage) {

                            alert(result.dataNotFoundMessage);

                            return;
                        }

                        extraData = result.data;
                    }

                    this._editor.getUndoManager().add(
                        new undo.ConvertTypeOperation(this._editor, targetType, extraData));

                    this.close();
                })
            );

            viewer.selectFirst();

            this.addButton("Cancel", () => this.close());
        }
    }
}