/// <reference path="./UserPropertyType.ts"/>
namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ColorPropertyType extends StringPropertyType {

        constructor(typeId = "color") {
            super(typeId, "#ffffff");
        }

        getName(): string {

            return "Color";
        }

        createEditorElement(getValue: () => any, setValue: (value: any) => void): IPropertyEditor {

            const formBuilder = new controls.properties.FormBuilder();

            const colorForm = formBuilder.createColor(undefined, false, true);

            colorForm.text.addEventListener("change", e => {

                setValue(colorForm.text.value);
            });

            const update = () => {

                colorForm.text.value = getValue();
                colorForm.btn.style.background = colorForm.text.value;
            };

            return {
                element: colorForm.element,
                update
            };
        }

        createInspectorPropertyEditor(section: SceneGameObjectSection<any>, parent: HTMLElement, userProp: UserProperty, lockIcon: boolean): void {

            section.createPropertyColorRow(parent, userProp.getComponentProperty(), true, lockIcon);
        }
    }
}