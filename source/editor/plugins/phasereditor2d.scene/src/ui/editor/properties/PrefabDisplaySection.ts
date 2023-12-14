namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class PrefabDisplaySection extends SceneSection {

        static SECTION_ID = "phasereditor2d.scene.ui.editor.properties.PrefabDisplaySection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, PrefabDisplaySection.SECTION_ID, "Prefab Display", false, false);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr";

            this.createStringField(comp, "prefabObjDisplayFmt", "Object Display Format", "To format the object's display label.");
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Scene && obj.getSceneType() === core.json.SceneType.PREFAB;
        }
    }
}