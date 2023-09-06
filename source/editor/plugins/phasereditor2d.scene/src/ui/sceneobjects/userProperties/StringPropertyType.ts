/// <reference path="./UserPropertyType.ts"/>
namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class StringPropertyType extends UserPropertyType<string> {

        constructor(typeId: string = "string", defValue = "") {
            super(typeId, defValue);
        }

        createInspectorPropertyEditor(
            section: SceneGameObjectSection<any>, parent: HTMLElement, userProp: UserProperty, lockIcon: boolean): void {

            section.createPropertyStringDialogRow(parent, userProp.getComponentProperty(), lockIcon);
        }

        buildDeclarePropertyCodeDOM(prop: UserProperty, value: string): code.FieldDeclCodeDOM {

            return this.buildStringFieldCode(prop, value);
        }

        buildSetObjectPropertyCodeDOM(comp: Component<any>, args: ISetObjectPropertiesCodeDOMArgs, userProp: UserProperty): void {

            comp.buildSetObjectPropertyCodeDOM_StringProperty(args, userProp.getComponentProperty());
        }

        getName() {

            return "String";
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