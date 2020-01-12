namespace phasereditor2d.scene.ui.editor.properties {

    export abstract class SceneSection extends BaseSceneSection<Scene> {

        protected getScene() {

            return this.getSelection()[0];
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
    }
}