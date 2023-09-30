namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export interface IPropertyEditor {

        element: HTMLElement;

        update(): void;
    }

    export abstract class UserPropertyType<TValue> {

        private _id: string;
        private _defValue: TValue;
        private _expressionType: string;

        constructor(id: string, defValue: TValue) {

            this._id = id;
            this._defValue = defValue;
            this._expressionType = "any";
        }

        getExpressionType() {

            return this._expressionType;
        }

        setExpressionType(expressionType: string) {

            this._expressionType = expressionType;
        }

        hasCustomPropertyType() {

            return false;
        }

        getId() {

            return this._id;
        }

        abstract getName(): string;

        getDefaultValue() {

            return this._defValue;
        }

        writeJSON(data: any) {

            data.id = this._id;

            if (this.hasCustomPropertyType()) {

                data.expressionType = this.getExpressionType();
            }
        }

        readJSON(data: any) {
            
            if (this.hasCustomPropertyType()) {

                this._expressionType = data.expressionType || "any";
            }
        }

        abstract createEditorElement(getValue: () => any, setValue: (value: any) => void): IPropertyEditor;

        abstract buildDeclarePropertyCodeDOM(prop: UserProperty, value: TValue): code.FieldDeclCodeDOM;

        abstract buildSetObjectPropertyCodeDOM(
            comp: Component<any>, args: ISetObjectPropertiesCodeDOMArgs, userProp: UserProperty): void;

        abstract createInspectorPropertyEditor(
            section: SceneGameObjectSection<any>, parent: HTMLElement, userProp: UserProperty, lockIcon: boolean): void;

        protected buildStringFieldCode(prop: UserProperty, value: string) {

            const decl = new code.FieldDeclCodeDOM(prop.getInfo().name, "string", true);

            decl.setInitialValueExpr(code.CodeDOM.quote(value));

            return decl;
        }

        protected buildExpressionFieldCode(prop: UserProperty, type: string, value: string) {

            const decl = new code.FieldDeclCodeDOM(prop.getInfo().name, type, true);
            
            decl.setAllowUndefined(true);
            decl.setInitialValueExpr(value);

            return decl;
        }

        protected buildNumberFieldCode(prop: UserProperty, value: number) {

            const decl = new code.FieldDeclCodeDOM(prop.getInfo().name, "number", true);

            decl.setInitialValueExpr(value.toString());

            return decl;
        }

        protected buildBooleanFieldCode(prop: UserProperty, value: boolean) {

            const decl = new code.FieldDeclCodeDOM(prop.getInfo().name, "boolean", true);

            decl.setInitialValueExpr(value.toString());

            return decl;
        }
    }
}