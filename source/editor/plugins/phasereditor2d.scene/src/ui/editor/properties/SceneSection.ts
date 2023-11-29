namespace phasereditor2d.scene.ui.editor.properties {

    export abstract class SceneSection extends BaseSceneSection<Scene> {

        protected getScene() {

            return this.getEditor().getScene();
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Scene;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }

        protected getSettings() {

            return this.getScene().getSettings();
        }

        getHelp(key: string) {

            return "TODO";
        }

        createStringField(comp: HTMLElement, name: string, label: string, tooltip: string) {

            const labelElement = this.createLabel(comp, label, tooltip);

            const textElement = this.createText(comp);

            this.addUpdater(() => {

                const value = this.getSettings()[name];
                
                textElement.value = value === undefined ? "" : value.toString();
            });

            textElement.addEventListener("change", e => {

                const editor = this.getEditor();

                editor.getUndoManager().add(new ChangeSettingsPropertyOperation({
                    editor: editor,
                    props: [{
                        name,
                        value: textElement.value,
                    }],
                    repaint: true
                }));
            });

            return {
                label: labelElement,
                text: textElement
            };
        }

        createIntegerField(comp: HTMLElement, name: string, label: string, tooltip: string) {

            const labelElement = this.createLabel(comp, label, tooltip);

            const textElement = this.createText(comp);

            this.addUpdater(() => {

                textElement.value = this.getSettings()[name].toString();
            });

            textElement.addEventListener("change", e => {

                const editor = this.getEditor();

                const value = this.parseNumberExpression(textElement, true);

                if (isNaN(value)) {

                    this.updateWithSelection();

                } else {

                    editor.getUndoManager().add(new ChangeSettingsPropertyOperation({
                        editor: editor,
                        props: [{
                            name: name,
                            value: value,
                        }],
                        repaint: true
                    }));
                }
            });

            return {
                label: labelElement,
                text: textElement
            };
        }

        createMenuField(
            comp: HTMLElement,
            getItems: () => Array<{ name: string, value: any }>,
            name: string, label: string, tooltip: string) {

            this.createLabel(comp, label, tooltip);

            const btn = this.createMenuButton(comp, "-", getItems, value => {

                const editor = this.getEditor();

                editor.getUndoManager().add(new ChangeSettingsPropertyOperation({
                    editor: editor,
                    props: [{
                        name: name,
                        value: value,
                    }],
                    repaint: true
                }));
            });

            this.addUpdater(() => {

                const item = getItems().find(i => i.value === this.getSettings()[name]);

                btn.textContent = item ? item.name : "-";
            });
        }

        createBooleanField(comp: HTMLElement, name: string, label?: HTMLLabelElement) {

            const checkElement = this.createCheckbox(comp, label);

            this.addUpdater(() => {

                checkElement.checked = this.getSettings()[name] as boolean;
            });

            checkElement.addEventListener("change", e => {

                const editor = this.getEditor();

                editor.getUndoManager().add(new ChangeSettingsPropertyOperation({
                    editor: editor,
                    props: [{
                        name: name,
                        value: checkElement.checked,
                    }],
                    repaint: true
                }));
            });

            return checkElement;
        }
    }
}