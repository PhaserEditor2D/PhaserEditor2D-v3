/// <reference path="UserPropertyType.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class NumberPropertyType extends UserPropertyType<number> {

        constructor() {
            super("number", 0);
        }

        getName() {

            return "Number";
        }

        renderValue(value: number): string {

            if (value === null || value === undefined) {

                return "";
            }

            return value.toString();
        }

        createEditorElement(getValue: () => any, setValue: (value: any) => void): IPropertyEditor {

            const element = document.createElement("input");
            element.type = "text";
            element.classList.add("formText");

            element.addEventListener("change", e => {

                const value = Number.parseFloat(element.value);

                setValue(value);
            });

            const update = () => {

                element.value = (getValue() as number).toString();
            };

            return {
                element,
                update
            };
        }
    }
}