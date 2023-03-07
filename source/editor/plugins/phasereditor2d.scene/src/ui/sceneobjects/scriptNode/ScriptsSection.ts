namespace phasereditor2d.scene.ui.sceneobjects {

    export class ScriptsSection extends SceneGameObjectSection<ScriptNode> {

        static SECTION_ID = "phasereditor2d.scene.ui.sceneobjects.ScriptsSection";

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, ScriptsSection.SECTION_ID, "Scripts");
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 1);

            this.createButton(comp, "Add Script", () => {
                
                const dlg = new AddScriptDialog(this.getEditor());

                dlg.create();
            });
        }

        canEdit(obj: any, n: number): boolean {

            return isGameObject(obj);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}