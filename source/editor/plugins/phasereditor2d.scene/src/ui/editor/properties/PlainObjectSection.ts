namespace phasereditor2d.scene.ui.editor.properties {

    export abstract class PlainObjectSection<T extends sceneobjects.IScenePlainObject>
        extends BaseSceneSection<T> {

        createPropertyString(parent: HTMLElement, prop: ui.sceneobjects.IProperty<any>) {

            const label = this.createLabel(parent, prop.label, PhaserHelp(prop.tooltip));

            const text = this.createStringField(parent, prop);

            return { label, text };
        }

        createStringField(
            parent: HTMLElement, property: ui.sceneobjects.IProperty<T>,
            readOnlyOnMultiple = false, multiLine = false) {

            const text = multiLine ? this.createTextArea(parent, false) : this.createText(parent, false);

            text.addEventListener("change", e => {

                const value = text.value;

                this.getEditor().getUndoManager().add(
                    new ui.sceneobjects.SimpleOperation(this.getEditor(), this.getSelection(), property, value));
            });

            this.addUpdater(() => {

                if (readOnlyOnMultiple) {

                    text.readOnly = text.readOnly || readOnlyOnMultiple && this.getSelection().length > 1;
                }

                text.value = this.flatValues_StringOneOrNothing(

                    this.getSelection()

                        .map(obj => property.getValue(obj))
                );
            });

            return text;
        }
    }
}