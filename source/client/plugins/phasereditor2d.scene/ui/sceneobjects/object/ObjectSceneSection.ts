namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class ObjectSceneSection<T extends ISceneObjectLike> extends editor.properties.BaseSceneSection<T> {

        // tslint:disable-next-line:ban-types
        createFloatField(parent: HTMLElement, property: IProperty<T>) {

            const text = this.createText(parent, false);

            text.addEventListener("change", e => {

                const val = Number.parseFloat(text.value);

                this.getEditor().getUndoManager().add(
                    new SimpleOperation(this.getEditor(), this.getSelection(), property, val));
            });

            this.addUpdater(() => {

                const values = [];

                for (const obj of this.getSelection()) {

                    const value = property.getValue(obj);
                    values.push(value);
                }

                text.value = values.length === 1 ? values[0].toString() : "";
            });

            return text;
        }

    }
}