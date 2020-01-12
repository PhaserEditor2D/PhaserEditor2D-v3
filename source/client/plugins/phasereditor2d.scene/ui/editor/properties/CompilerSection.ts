namespace phasereditor2d.scene.ui.editor.properties {

    import io = colibri.core.io;
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

            this.createPreloadPackFilesField(comp);

            this.createStringField(
                comp, "preloadMethodName", "Preload Method", "The name of the preload method. It may be empty.");

            this.createStringField(
                comp, "createMethodName", "Create Method", "The name of the create method.");
        }

        private createPreloadPackFilesField(parent: HTMLElement) {

            this.createLabel(parent, "Preload Pack Files", "The Pack files to be loaded in this scene.");

            const btn = this.createButton(parent, "0 selected", async (e) => {

                const viewer = new controls.viewers.TreeViewer();
                viewer.setLabelProvider(new files.ui.viewers.FileLabelProvider());
                viewer.setCellRendererProvider(new files.ui.viewers.FileCellRendererProvider("tree"));
                viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

                const finder = new pack.core.PackFinder();
                await finder.preload();

                const packs =

                    viewer.setInput(finder.getPacks().map(pack => pack.getFile()));

                viewer.setSelection(

                    this.getSettings().preloadPackFiles

                        .map(name => finder.getPacks().find(pack => pack.getFile().getFullName() === name))

                        .filter(pack => pack !== null && pack !== undefined)

                        .map(pack => pack.getFile())
                );

                const dlg = new controls.dialogs.ViewerDialog(viewer);

                const selectionCallback = (files: io.FilePath[]) => {

                    const names = files.map(file => file.getFullName());

                    this.getEditor().getUndoManager().add(new ChangeSettingsPropertyOperation({
                        editor: this.getEditor(),
                        name: "preloadPackFiles",
                        value: names,
                        repaint: false
                    }));

                    this.updateWithSelection();

                    dlg.close();
                };

                dlg.create();

                dlg.setTitle("Select Pack Files");

                const selectBtn = dlg.addButton("Select", () => {

                    selectionCallback(viewer.getSelection());
                });

                selectBtn.textContent = "Select " + viewer.getSelection().length + " Files";

                viewer.addEventListener(controls.EVENT_SELECTION_CHANGED, () => {

                    selectBtn.textContent = "Select " + viewer.getSelection().length + " Files";
                });

                dlg.addButton("Clear", () => {

                    viewer.setSelection([]);
                });

                dlg.addButton("Cancel", () => {
                    dlg.close();
                });

                viewer.addEventListener(controls.viewers.EVENT_OPEN_ITEM, async (e) => {

                    selectionCallback([viewer.getSelection()[0]]);
                });
            });

            this.addUpdater(() => {

                btn.textContent = this.getSettings().preloadPackFiles.length + " selected";
            });
        }
    }
}