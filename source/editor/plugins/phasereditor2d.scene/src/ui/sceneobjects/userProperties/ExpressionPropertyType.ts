/// <reference path="./UserPropertyType.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class ExpressionPropertyType extends UserPropertyType<string> {

        private _expressionType: string;

        constructor() {
            super("expression", "");

            this._expressionType = "any";
        }

        getExpressionType() {

            return this._expressionType;
        }

        setExpressionType(expressionType: string) {

            this._expressionType = expressionType;
        }

        writeJSON(data: any) {

            super.writeJSON(data);

            data.expressionType = this._expressionType;
        }

        readJSON(data: any) {

            super.readJSON(data);

            this._expressionType = data.expressionType || "any";
        }

        getName() {

            return "Expression";
        }

        renderValue(value: any): string {

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

        buildDeclarePropertyCodeDOM(prop: UserProperty, value: string): core.code.MemberDeclCodeDOM[] {

            return [this.buildExpressionFieldCode(prop, this._expressionType, value)];
        }

        buildSetObjectPropertyCodeDOM(comp: Component<any>, args: ISetObjectPropertiesCodeDOMArgs, userProp: UserProperty): void {

            comp.buildSetObjectPropertyCodeDOM_StringVerbatimProperty(args, userProp.getComponentProperty());
        }

        createInspectorPropertyEditor(section: SceneGameObjectSection<any>, parent: HTMLElement, userProp: UserProperty, lockIcon: boolean): void {

            section.createPropertyStringRow(parent, userProp.getComponentProperty(), lockIcon);
        }
    }
}