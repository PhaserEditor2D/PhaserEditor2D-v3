namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export interface IPropertyEditor {

        element: HTMLElement;

        update(): void;
    }

    export abstract class UserPropertyType<TValue> {

        private _id: string;
        private _defValue: TValue;

        constructor(id: string, defValue: TValue) {

            this._id = id;
            this._defValue = defValue;
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
        }

        readJSON(data: any) {
            // nothing
        }

        abstract renderValue(value: any): string;

        abstract createEditorElement(getValue: () => any, setValue: (value: any) => void): IPropertyEditor;

        abstract buildDeclarePropertyCodeDOM(prop: UserProperty, value: TValue): code.MemberDeclCodeDOM[];

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