/// <reference path="UserPropertyType.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class BooleanPropertyType extends UserPropertyType<boolean> {

        constructor() {
            super("boolean", false);
        }

        createInspectorPropertyEditor(section: SceneGameObjectSection<any>, parent: HTMLElement, userProp: UserProperty, lockIcon: boolean): void {

            section.createPropertyBoolean(parent, userProp.getComponentProperty(), lockIcon);
        }

        getName() {

            return "Boolean";
        }

        buildSetObjectPropertyCodeDOM(
            comp: Component<any>, args: ISetObjectPropertiesCodeDOMArgs, userProp: UserProperty): void {

            comp.buildSetObjectPropertyCodeDOM_BooleanProperty(args, userProp.getComponentProperty());
        }

        buildDeclarePropertyCodeDOM(prop: UserProperty, value: boolean): code.FieldDeclCodeDOM {

            return this.buildBooleanFieldCode(prop, value);
        }

        createEditorElement(getValue: () => any, setValue: (value: any) => void): IPropertyEditor {

            const element = document.createElement("input");
            element.type = "checkbox";
            element.classList.add("formCheckbox");

            element.addEventListener("change", e => {

                const value = element.checked;

                setValue(value);
            });

            const update = () => {

                element.checked = getValue() as boolean;
            };

            return {
                element,
                update
            };
        }
    }
}