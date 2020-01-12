namespace phasereditor2d.scene.ui.editor.properties {

    export abstract class SceneSection extends BaseSceneSection<Scene> {

        protected getScene() {

            return this.getSelection()[0];
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

        createIntegerField(comp: HTMLElement, name: string, label: string, tooltip: string) {

            const labelElement = this.createLabel(comp, label, tooltip);

            const textElement = this.createText(comp);

            this.addUpdater(() => {

                textElement.value = this.getSettings()[name].toString();
            });

            textElement.addEventListener("change", e => {

                const editor = this.getEditor();

                editor.getUndoManager().add(new ChangeSettingsPropertyOperation({
                    editor: editor,
                    name: name,
                    value: Number.parseInt(textElement.value, 10),
                    repaint: true
                }));
            });

            return {
                label: labelElement,
                text: textElement
            };
        }

        createBooleanField(comp: HTMLElement, name: string, label: string, tooltip: string) {

            const comp2 = document.createElement("div");
            comp2.classList.add("formGrid");
            comp2.style.gridTemplateColumns = "auto 1fr";

            comp.appendChild(comp2);

            const checkElement = this.createCheckbox(comp2);

            const labelElement = this.createLabel(comp2, label, tooltip);

            this.addUpdater(() => {

                checkElement.checked = this.getSettings()[name] as boolean;
            });

            checkElement.addEventListener("change", e => {

                const editor = this.getEditor();

                editor.getUndoManager().add(new ChangeSettingsPropertyOperation({
                    editor: editor,
                    name: name,
                    value: checkElement.checked,
                    repaint: true
                }));
            });

            return {
                comp: comp2,
                label: labelElement,
                check: checkElement
            };
        }
    }
}