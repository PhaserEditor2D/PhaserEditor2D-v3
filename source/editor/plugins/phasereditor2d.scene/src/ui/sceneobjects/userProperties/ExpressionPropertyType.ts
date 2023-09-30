/// <reference path="./UserPropertyType.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    export class ExpressionPropertyType extends UserPropertyType<string> {

        constructor() {
            super("expression", "");

            this.setExpressionType("any");
        }

        hasCustomPropertyType(): boolean {

            return true;
        }

        getName() {

            return "Expression";
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

        buildDeclarePropertyCodeDOM(prop: UserProperty, value: string): core.code.FieldDeclCodeDOM {

            return this.buildExpressionFieldCode(prop, this.getExpressionType(), value);
        }

        buildSetObjectPropertyCodeDOM(comp: Component<any>, args: ISetObjectPropertiesCodeDOMArgs, userProp: UserProperty): void {

            comp.buildSetObjectPropertyCodeDOM_StringVerbatimProperty(args, userProp.getComponentProperty());
        }

        createInspectorPropertyEditor(section: SceneGameObjectSection<any>, parent: HTMLElement, userProp: UserProperty, lockIcon: boolean): void {

            section.createPropertyStringRow(parent, userProp.getComponentProperty(), lockIcon);
        }
    }
}