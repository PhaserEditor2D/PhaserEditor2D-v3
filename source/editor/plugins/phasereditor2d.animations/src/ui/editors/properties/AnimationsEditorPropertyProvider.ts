namespace phasereditor2d.animations.ui.editors.properties {

    import controls = colibri.ui.controls;

    export class AnimationsEditorPropertyProvider extends pack.ui.properties.AssetPackPreviewPropertyProvider {

        constructor() {
            super();
        }

        addSections(page: controls.properties.PropertyPage, sections: Array<controls.properties.PropertySection<any>>) {

            super.addSections(page, sections);

            sections.push(
                new AnimationSection(page),
                new AnimationPreviewFrameSection(page),
                new ManyAnimationFramesPreviewSection(page)
            );
        }
    }
}