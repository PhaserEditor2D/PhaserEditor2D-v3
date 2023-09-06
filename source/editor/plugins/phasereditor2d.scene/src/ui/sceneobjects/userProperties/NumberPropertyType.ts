/// <reference path="UserPropertyType.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class NumberPropertyType extends UserPropertyType<number> {

        constructor(typeId = "number") {
            super(typeId, 0);
        }

        createInspectorPropertyEditor(section: SceneGameObjectSection<any>, parent: HTMLElement, userProp: UserProperty, lockIcon: boolean): void {

            section.createPropertyFloatRow(parent, userProp.getComponentProperty(), lockIcon);
        }

        getName() {

            return "Number";
        }

        buildSetObjectPropertyCodeDOM(
            comp: Component<any>, args: ISetObjectPropertiesCodeDOMArgs, userProp: UserProperty): void {

            comp.buildSetObjectPropertyCodeDOM_FloatProperty(args, userProp.getComponentProperty());
        }

        buildDeclarePropertyCodeDOM(prop: UserProperty, value: number): code.FieldDeclCodeDOM {

            return this.buildNumberFieldCode(prop, value);
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