namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class PlainObjectSection<T extends IScenePlainObject>
        extends SceneObjectSection<T> {

        createDefaultGridElement(parent: HTMLElement) {

            const comp = this.createGridElement(parent, 2);
            
            comp.style.gridTemplateColumns = "auto 1fr";

            return comp;
        }

        createPropertyObjectVar(parent: HTMLElement, prop: IProperty<T>) {

            const labelElement = this.createLabel(parent, prop.label, PhaserHelp(prop.tooltip));

            const { textElement } = this.createObjectVarField(parent, prop);

            return { labelElement, textElement };
        }

        createPropertyString(parent: HTMLElement, prop: IProperty<T>) {

            const labelElement = this.createLabel(parent, prop.label, PhaserHelp(prop.tooltip));

            const textElement = this.createStringField(parent, prop);

            return { labelElement, textElement };
        }

        createPropertyBoolean(parent: HTMLElement, prop: IProperty<T>) {

            const elements = this.createBooleanField(parent, prop);

            return elements;
        }
    }
}