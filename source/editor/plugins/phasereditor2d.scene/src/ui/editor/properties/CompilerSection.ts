namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class CompilerSection extends SceneSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.editor.properties.CompilerSection",
                "Compiler General Settings", false, true);
        }

        getSectionHelpPath() {

            return "scene-editor/scene-compiler-general-settings.html";
        }

        createMenu(menu: controls.Menu) {

            this.getEditor().getMenuCreator().createCompilerMenu(menu);

            menu.addSeparator();

            super.createMenu(menu);
        }

        createForm(parent: HTMLDivElement) {

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
                comp, () => [
                    {
                        name: "JavaScript",
                        value: ide.core.code.SourceLang.JAVA_SCRIPT,
                    },
                    {
                        name: "TypeScript",
                        value: ide.core.code.SourceLang.TYPE_SCRIPT
                    }],
                "compilerOutputLanguage", "Output Language",
                "The scene compiler output language.");

            this.createBooleanField(comp, "javaScriptInitFieldsInConstructor",

                this.createLabel(comp, "Fields In Constructor (JS)", "Generate the initialization of the fields in the constructor. This is valid only when the output is JavaScript.")
            );

            this.createBooleanField(comp, "exportClass",

                this.createLabel(comp, "Export Class (ES Module)", "Export the generated class.")
            );

            this.createBooleanField(comp, "autoImport",

                this.createLabel(comp, "Auto Import (ES Module)", "Automatic import used classes like prefabs and user components.")
            );

            this.createStringField(
                comp, "superClassName", "Super Class",
                "The super class used for the scene. If it is blank (no-value) then use default value.");

            this.createBooleanField(comp, "compilerInsertSpaces",

                this.createLabel(comp, "Insert Spaces", "Insert convert tabs to spaces"));

            this.createIntegerField(comp, "compilerTabSize", "Tab Size", "The size of tabs, in spaces.");
        }
    }
}