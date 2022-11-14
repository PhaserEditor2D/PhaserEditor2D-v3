namespace phasereditor2d.animations.ui.editors.properties {

    import controls = colibri.ui.controls;

    export class AnimationsEditorPropertyProvider extends pack.ui.properties.AssetPackPreviewPropertyProvider {

        constructor() {
            super();
        }

        addSections(page: controls.properties.PropertyPage, sections: Array<controls.properties.PropertySection<any>>) {

            sections.push(new BuildAnimationsSection(page));

            super.addSections(page, sections);

            sections.push(
                new AnimationSection(page),
                new AnimationCompilerSection(page),
                new AnimationPreviewFrameSection(page),
                new ManyAnimationFramesPreviewSection(page)
            );
        }

        getEmptySelectionArray() {

            const wb = colibri.Platform.getWorkbench();

            const editor = wb.getActiveEditor();

            if (editor instanceof AnimationsEditor) {

                const activePart = colibri.Platform.getWorkbench().getActivePart();

                if (activePart instanceof AnimationsEditor
                    || activePart instanceof colibri.inspector.ui.views.InspectorView
                    || activePart instanceof phasereditor2d.outline.ui.views.OutlineView) {

                    return [editor.getModel()];
                }
            }

            return null;
        }
    }
}