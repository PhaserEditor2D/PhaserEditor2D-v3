namespace phasereditor2d.scene.ui.editor.properties {

    import io = colibri.core.io;
    import controls = colibri.ui.controls;

    export class PrefabCompilerSection extends SceneSection {

        constructor(page: controls.properties.PropertyPage) {
            super(
                page, "phasereditor2d.scene.ui.editor.properties.PrefabCompilerSection",
                "Compiler Prefab Settings", false, true);
        }

        getSectionHelpPath() {
            return "scene-editor/scene-compiler-scene-settings.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr";

            this.createBooleanField(comp, "generateAwakeHandler",

                this.createLabel(comp, "Generate Awake Handler",
                    "Generate a handler for the 'scene-awake' event."));
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Scene && obj.getSceneType() === core.json.SceneType.PREFAB;
        }
    }
}