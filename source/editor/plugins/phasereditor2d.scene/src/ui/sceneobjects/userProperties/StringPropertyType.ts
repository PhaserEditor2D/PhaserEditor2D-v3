namespace phasereditor2d.scene.ui.sceneobjects {

    export class StringPropertyType extends UserPropertyType<string> {

        constructor() {
            super("string", "");
        }

        getName() {

            return "String";
        }

        renderValue(value: string): string {

            return value;
        }

        createEditorElement(getValue: () => any, setValue: (value: any) => void): IPropertyEditor {

            const element = document.createElement("input");
            element.type = "text";
            element.classList.add("formText");

            element.addEventListener("change", e => {

                setValue(element.value);
            });

            const update = () => {

                element.value = getValue();
            };

            return {
                element,
                update
            };
        }
    }
}