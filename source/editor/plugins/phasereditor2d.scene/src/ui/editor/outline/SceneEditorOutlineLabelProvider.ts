namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;

    export class SceneEditorOutlineLabelProvider extends controls.viewers.LabelProviderFromStyledLabelProvider {

        constructor() {
            super(new SceneEditorOutlineStyledLabelProvider());
        }
    }
}