namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class CompilerSection extends SceneSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "id", "Compiler");
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr";


            this.createMenuField(
                comp, [
                {
                    name: "Scene",
                    value: core.json.SceneType.SCENE,
                },
                {
                    name: "Prefab",
                    value: core.json.SceneType.PREFAB,
                }],
                "sceneType", "Scene Type",
                "If this is a regular scene or a prefab.");

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
                comp, "sceneKey", "Scene Key",
                "The key of the scene. Used when the scene is loaded with the Phaser loader.");

            this.createStringField(
                comp, "superClassName", "Super Class",
                "The super class used for the scene. If it is blank (no-value) then use default value.");

            this.createBooleanField(comp, "onlyGenerateMethods",

                this.createLabel(comp, "Only Generate Methods",
                    "No class code is generated, only the \"create\" or \"preload\" methods."));
        }
    }
}