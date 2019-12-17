namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;

    export class SceneEditorOutlineLabelProvider implements controls.viewers.ILabelProvider {

        getLabel(obj: any): string {

            if (obj instanceof Phaser.GameObjects.GameObject) {
                return (obj as gameobjects.EditorObject).getEditorLabel();
            }

            if (obj instanceof Phaser.GameObjects.DisplayList) {
                return "Display List";
            }

            return "" + obj;
        }

    }

}