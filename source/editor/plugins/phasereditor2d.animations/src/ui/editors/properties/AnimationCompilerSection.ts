namespace phasereditor2d.animations.ui.editors.properties {

    import controls = colibri.ui.controls;
    import SourceLang = phasereditor2d.ide.core.code.SourceLang;
    import io = colibri.core.io;

    export class AnimationCompilerSection extends controls.properties.PropertySection<Phaser.Animations.Animation | AnimationsModel> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.animations.ui.editors.properties.AnimationCompilerSection", "Compiler Settings");
        }

        createMenu(menu: controls.Menu) {

            ide.IDEPlugin.getInstance().createHelpMenuItem(menu, "animations-editor");
        }

        hasMenu() {

            return true;
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            this.createBooleanProperty(comp, "generateCode", "Generate Code", "Generate code?");

            this.createMenuField(
                comp, () => [
                    {
                        name: "JavaScript",
                        value: SourceLang.JAVA_SCRIPT,
                    },
                    {
                        name: "TypeScript",
                        value: SourceLang.TYPE_SCRIPT
                    }],
                "compilerOutputLanguage", "Output Language",
                "The scene compiler output language.");

            this.createBooleanProperty(comp, "esModule", "ES Module", "If generate the code with the ES module syntax.");

            this.folderProperty(comp, "outputFolder", "Output Folder", "The folder where the compiled file is generated.")
        }

        private folderProperty(parent: HTMLElement, field: string, labelText: string, tooltip: string) {

            this.createLabel(parent, labelText, tooltip);

            const comp = this.createGridElement(parent, 2);
            comp.style.gridTemplateColumns = "1fr auto";
            comp.style.padding = "0px";
            parent.appendChild(comp);

            const text = this.createText(comp, true);

            const dlg = this.createButtonDialog({
                createDialogViewer: async (revealValue) => {

                    const viewer = new controls.viewers.TreeViewer("AnimationsCompilerSection.outputFolder");

                    const root = colibri.ui.ide.Workbench.getWorkbench().getProjectRoot();

                    const viewers = phasereditor2d.files.ui.viewers;

                    viewer.setStyledLabelProvider(new viewers.StyledFileLabelProvider());
                    viewer.setContentProvider(new viewers.FileTreeContentProvider(true));
                    viewer.setCellRendererProvider(new viewers.FileCellRendererProvider());
                    viewer.setInput(root);
                    viewer.setExpanded(root, true);

                    const name = this.getModel().outputFolder || "";

                    const folder = colibri.ui.ide.FileUtils.getFileFromPath(name);

                    if (folder) {

                        viewer.revealAndSelect(folder);
                    }

                    return viewer;
                },
                getValue: () => {

                    return this.getModel().outputFolder;
                },
                dialogElementToString(viewer, value: io.FilePath) {

                    return value.getFullName();
                },
                dialogTittle: "Select Output Folder",

                onValueSelected: (value: string) => {

                    this.getEditor().runSettingsOperation(() => {

                        this.getModel().outputFolder = value;

                        this.updateWithSelection();
                    });
                },
            });

            comp.appendChild(dlg.buttonElement);

            this.addUpdater(() => {

                text.value = this.getModel().outputFolder || "";
            })
        }

        private createMenuField(
            comp: HTMLElement,
            getItems: () => Array<{ name: string, value: ide.core.code.SourceLang }>,
            name: string, label: string, tooltip: string) {

            this.createLabel(comp, label, tooltip);

            const btn = this.createMenuButton(comp, "-", getItems, value => {

                const editor = this.getEditor();

                editor.runSettingsOperation(() => {

                    editor.getModel().sourceLang = value;

                    this.updateWithSelection();
                })
            });

            this.addUpdater(() => {

                const model = this.getModel();

                const lang = model.sourceLang;

                btn.textContent = lang === SourceLang.TYPE_SCRIPT ? "TypeScript" : "JavaScript";
            });
        }

        private createBooleanProperty(parent: HTMLElement, field: string, labelText: string, tooltip: string) {

            const checkbox = this.createCheckbox(parent, this.createLabel(parent, labelText, tooltip));

            checkbox.addEventListener("change", e => {

                this.getEditor().runSettingsOperation(() => {

                    const value = checkbox.checked;

                    this.getEditor().getModel()[field] = value;
                });
            });

            this.addUpdater(() => {

                checkbox.checked = this.flatValues_BooleanAnd(this.getSelection().map(a => a[field]));
            })
        }

        private getModel() {

            return this.getSelectionFirstElement() as AnimationsModel;
        }

        private getEditor() {

            const editor = colibri.Platform.getWorkbench().getActiveEditor();

            return editor instanceof AnimationsEditor ? editor : null;
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof AnimationsModel;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}