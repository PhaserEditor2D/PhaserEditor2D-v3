namespace phasereditor2d.scene.ui.editor.properties {

    import io = colibri.core.io;
    import controls = colibri.ui.controls;

    export class PrefabCompilerSection extends SceneSection {

        constructor(page: controls.properties.PropertyPage) {
            super(
                page, "phasereditor2d.scene.ui.editor.properties.PrefabCompilerSection",
                "Compiler Prefab Settings", false, true);
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr";

            this.createStringField(
                comp, "prefabInitMethodName", "User Init Method",
                "If provided, this method will be called at the end of the prefab constructor.");

        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Scene && obj.getSettings().sceneType === core.json.SceneType.PREFAB;
        }
    }
}