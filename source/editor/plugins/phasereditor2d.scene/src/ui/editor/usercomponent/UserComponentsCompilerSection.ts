namespace phasereditor2d.scene.ui.editor.usercomponent {

    import controls = colibri.ui.controls;

    export class UserComponentsCompilerSection extends controls.properties.PropertySection<UserComponentsModel> {

        constructor(page: controls.properties.PropertyPage) {
            super(page,
                "phasereditor2d.scene.ui.editor.usercomponent.UserComponentsCompilerSection",
                "Compiler Settings", false, false);
        }

        hasMenu() {

            return true;
        }

        createMenu(menu: controls.Menu) {

            ide.IDEPlugin.getInstance().createHelpMenuItem(menu, "scene-editor/user-components-compiler.html");
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            {
                // Output Lang

                this.createLabel(comp, "Output Language", "The components code output language.");

                const btn = this.createMenuButton(comp, "", () => [{
                    name: "JavaScript",
                    value: ide.core.code.SourceLang.JAVA_SCRIPT
                }, {
                    name: "TypeScript",
                    value: ide.core.code.SourceLang.TYPE_SCRIPT
                }], value => {

                    this.getEditor().runOperation(model => {

                        model.setOutputLang(value);

                        this.updateWithSelection();
                    });
                });

                this.addUpdater(() => {

                    const lang = this.getSelectionFirstElement().getOutputLang();

                    btn.textContent = lang === ide.core.code.SourceLang.JAVA_SCRIPT ?
                        "JavaScript" : "TypeScript";
                });
            }
            {
                // Fields In Constructor

                const checkbox = this.createCheckbox(comp, this.createLabel(comp, "Fields In Constructor (JS)", "Generate the initialization of the fields in the constructor. This is valid only when the output is JavaScript."));

                checkbox.addEventListener("change", e => {

                    this.getEditor().runOperation(model => {

                        model.javaScriptInitFieldsInConstructor = checkbox.checked;
                    });
                });

                this.addUpdater(() => {

                    checkbox.checked = this.getSelectionFirstElement().javaScriptInitFieldsInConstructor;
                });
            }

            {
                // Export Class

                const checkbox = this.createCheckbox(comp, this.createLabel(comp, "Export Class (ES Module)", "Export the class."));

                checkbox.addEventListener("change", e => {

                    this.getEditor().runOperation(model => {

                        model.exportClass = checkbox.checked;
                    });
                });

                this.addUpdater(() => {

                    checkbox.checked = this.getSelectionFirstElement().exportClass;
                });
            }

            {
                // Auto Import

                const checkbox = this.createCheckbox(comp, this.createLabel(comp, "Auto Import (ES Module)", "Auto import types used in the component."));

                checkbox.addEventListener("change", e => {

                    this.getEditor().runOperation(model => {

                        model.autoImport = checkbox.checked;
                    });
                });

                this.addUpdater(() => {

                    checkbox.checked = this.getSelectionFirstElement().autoImport;
                });
            }

            {
                // Insert Spaces

                const checkbox = this.createCheckbox(comp, this.createLabel(comp, "Insert Spaces", "Use spaces for indentation."));

                checkbox.addEventListener("change", e => {

                    this.getEditor().runOperation(model => {

                        model.insertSpaces = checkbox.checked;
                    });
                });

                this.addUpdater(() => {

                    checkbox.checked = this.getSelectionFirstElement().insertSpaces;
                });
            }

            {
                // Tab Size

                this.createLabel(comp, "Tab Size", "The number of spaces if the Insert Spaces option is checked.");

                const text = this.createText(comp);

                text.addEventListener("change", e => {

                    const n = Number.parseInt(text.value, 10);

                    if (isNaN(n)) {

                        this.updateWithSelection();

                    } else {

                        this.getEditor().runOperation(model => {

                            model.tabSize = n;
                        });
                    }
                });

                this.addUpdater(() => {

                    text.value = this.getSelectionFirstElement().tabSize.toString();
                });
            }
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof UserComponentsModel;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }

        getEditor() {

            return colibri.Platform.getWorkbench()
                .getActiveWindow().getEditorArea()
                .getSelectedEditor() as UserComponentsEditor;
        }
    }
}