namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class SceneDisplaySection extends SceneSection {

        static SECTION_ID = "phasereditor2d.scene.ui.editor.properties.SceneDisplaySection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, SceneDisplaySection.SECTION_ID, "Scene Display", false, false);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr";

            this.createStringField(comp, "displayName", "Scene Display Name", "The display name of the scene.");
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Scene;
        }
    }
}