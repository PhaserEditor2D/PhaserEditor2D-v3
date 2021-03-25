namespace phasereditor2d.scene.ui.editor.usercomponent {

    import controls = colibri.ui.controls;

    export class UserComponentSection extends controls.properties.PropertySection<UserComponent> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.editor.usercomponent.UserComponentSection", "Component", false, false);
        }

        hasMenu() {

            return true;
        }

        createMenu(menu: controls.Menu) {

            ide.IDEPlugin.getInstance().createHelpMenuItem(menu, "scene-editor/user-components-editor-edit-component.html");
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            {
                // Name

                const text = this.stringProp(comp, "Name", "Name",
                    "Name of the component. In the compiled code, it is used as file name and class name.");

                this.addUpdater(() => {

                    text.readOnly = this.getSelection().length > 1;
                });
            }

            this.stringProp(comp, "GameObjectType", "Game Object Type",
                "Name of the type of the Game Object that this component can be added on.");

            this.stringProp(comp, "BaseClass", "Super Class", "Name of the super class of the component. It is optional.");

            this.booleanProp(comp,
                "ListenStart", "Listen Start Event", "Listen the `start()` event. Requires `UserComponent` as super-class.");

            this.booleanProp(comp,
                "ListenUpdate", "Listen Update Event", "Listen the `update()` event. Requires `UserComponent` as super-class.");

            this.booleanProp(comp,
                "ListenDestroy", "Listen Destroy Event",
                "Listen the `destroy()` event. Fired when the game object is destroyed. Requires `UserComponent` as super-class.");
        }

        private stringProp(comp: HTMLElement, prop: string, propName: string, propHelp: string) {

            this.createLabel(comp, propName, propHelp);

            const text = this.createText(comp);

            text.addEventListener("change", e => {

                this.getEditor().runOperation(() => {

                    for (const comp1 of this.getSelection()) {

                        comp1["set" + prop](text.value);
                    }
                });
            });

            this.addUpdater(() => {

                text.value = this.flatValues_StringOneOrNothing(
                    this.getSelection().map(c => c["get" + prop]()));
            });

            return text;
        }

        private booleanProp(comp: HTMLElement, prop: string, propName: string, propHelp: string) {

            const checkbox = this.createCheckbox(comp, this.createLabel(comp, propName, propHelp));

            checkbox.addEventListener("change", e => {

                this.getEditor().runOperation(() => {

                    for (const comp1 of this.getSelection()) {

                        comp1["set" + prop](checkbox.checked);
                    }
                });
            });

            this.addUpdater(() => {

                checkbox.checked = this.flatValues_BooleanAnd(
                    this.getSelection().map(c => c["is" + prop]()));
            });

            return checkbox;
        }

        getEditor() {

            return colibri.Platform.getWorkbench()
                .getActiveWindow().getEditorArea()
                .getSelectedEditor() as UserComponentsEditor;
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof UserComponent;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}