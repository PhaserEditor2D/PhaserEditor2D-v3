namespace phasereditor2d.scene.ui.editor.properties {

    import io = colibri.core.io;
    import controls = colibri.ui.controls;

    export class CompilerSection extends SceneSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.editor.properties.CompilerSection",
                "Compiler General Settings", false, true);
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr";

            // this.createMenuField(
            //     comp, [
            //     {
            //         name: "Scene",
            //         value: core.json.SceneType.SCENE,
            //     },
            //     {
            //         name: "Prefab",
            //         value: core.json.SceneType.PREFAB,
            //     }],
            //     "sceneType", "Scene Type",
            //     "If this is a regular scene or a prefab.");

            this.createBooleanField(comp, "compilerEnabled",

                this.createLabel(comp, "Generate Code",
                    "Compiles the scene into code."));

            this.createMenuField(
                comp, [
                {
                    name: "JavaScript",
                    value: core.json.SourceLang.JAVA_SCRIPT,
                },
                {
                    name: "TypeScript",
                    value: core.json.SourceLang.TYPE_SCRIPT
                }],
                "compilerOutputLanguage", "Output Language",
                "The scene compiler output language.");

            this.createStringField(
                comp, "superClassName", "Super Class",
                "The super class used for the scene. If it is blank (no-value) then use default value.");

            this.createStringField(
                comp, "createMethodName", "Create Method", "The name of the create method.");
        }
    }
}