namespace phasereditor2d.scene.ui.editor.properties {

    import io = colibri.core.io;
    import controls = colibri.ui.controls;

    export class SceneCompilerSection extends SceneSection {

        constructor(page: controls.properties.PropertyPage) {
            super(
                page, "phasereditor2d.scene.ui.editor.properties.SceneCompilerSection",
                "Compiler Scene Settings", false, true);
        }

        getSectionHelpPath() {
            return "scene-editor/scene-compiler-scene-settings.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr";

            this.createStringField(
                comp, "sceneKey", "Scene Key",
                "The key of the scene. Used when the scene is loaded with the Phaser loader.");

            this.createBooleanField(comp, "onlyGenerateMethods",

                this.createLabel(comp, "Only Generate Methods",
                    "No class code is generated, only the \"create\" or \"preload\" methods."));

            this.createStringField(
                comp, "createMethodName", "Create Method", "The name of the create method.");

            this.createPreloadPackFilesField(comp);

            this.createStringField(
                comp, "preloadMethodName", "Preload Method", "The name of the preload method. It may be empty.");
        }

        private createPreloadPackFilesField(parent: HTMLElement) {

            this.createLabel(parent, "Preload Pack Files", "The Pack files to be loaded in this scene.");

            const btn = this.createButton(parent, "0 selected", async (e) => {

                const viewer = new controls.viewers.TreeViewer("phasereditor2d.scene.ui.editor.properties.SceneCompilerSection.SelectPackDialog");
                viewer.setLabelProvider(new files.ui.viewers.FileLabelProvider());
                viewer.setCellRendererProvider(new files.ui.viewers.FileCellRendererProvider("tree"));
                viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

                const finder = this.getEditor().getPackFinder();

                viewer.setInput(finder.getPacks().map(pack => pack.getFile()));

                viewer.setSelection(

                    this.getSettings().preloadPackFiles

                        .map(name => finder.getPacks().find(pack => pack.getFile().getFullName() === name))

                        .filter(pack => pack !== null && pack !== undefined)

                        .map(pack => pack.getFile())
                );

                const dlg = new controls.dialogs.ViewerDialog(viewer, false);

                const selectionCallback = (files: io.FilePath[]) => {

                    const names = files.map(file => file.getFullName());

                    this.getEditor().getUndoManager().add(new ChangeSettingsPropertyOperation({
                        editor: this.getEditor(),
                        props: [{
                            name: "preloadPackFiles",
                            value: names
                        }],
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

                viewer.eventSelectionChanged.addListener(() => {

                    selectBtn.textContent = "Select " + viewer.getSelection().length + " Files";
                });

                dlg.addButton("Clear", () => {

                    viewer.setSelection([]);
                });

                dlg.addButton("Cancel", () => {
                    dlg.close();
                });

                viewer.eventOpenItem.addListener(() => {

                    selectionCallback([viewer.getSelection()[0]]);
                });
            });

            this.addUpdater(() => {

                const settings = this.getSettings();

                btn.textContent = settings.preloadPackFiles.length + " selected";

                const files = settings.preloadPackFiles;

                const tooltip = files.length === 0 ? "Click to select the Asset Pack files."
                    : files.map(f => `<code>${f}</code>`)
                        .join("<br>");

                controls.Tooltip.tooltip(btn, tooltip);
            });
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Scene && obj.getSceneType() === core.json.SceneType.SCENE;
        }
    }
}