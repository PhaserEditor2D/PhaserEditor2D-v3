namespace phasereditor2d.animations.ui.editors {

    import controls = colibri.ui.controls;

    export class AnimationsEditorOutlineContentProvider implements controls.viewers.ITreeContentProvider {

        getRoots(input: any): any[] {

            const editor = input as AnimationsEditor;

            const manager = editor.getScene().anims;

            return manager ? manager["anims"].getArray() : [];
        }

        getChildren(parent: any): any[] {

            if (parent instanceof Phaser.Animations.Animation) {

                return parent.frames;
            }

            return [];
        }
    }
}