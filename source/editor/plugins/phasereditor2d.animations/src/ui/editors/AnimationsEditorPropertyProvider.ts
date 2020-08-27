namespace phasereditor2d.animations.ui.editors {

    import controls = colibri.ui.controls;

    export class AnimationsEditorPropertyProvider extends pack.ui.properties.AssetPackPreviewPropertyProvider {

        constructor() {
            super();
        }

        addSections(page: controls.properties.PropertyPage, sections: Array<controls.properties.PropertySection<any>>) {

            super.addSections(page, sections);

            sections.push(new AnimationPreviewFrameSection(page));
            sections.push(new ManyAnimationFramesPreviewSection(page));
        }
    }
}