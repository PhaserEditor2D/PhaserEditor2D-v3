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

        abstract getName();

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

        abstract buildCode(prop: UserProperty, value: TValue): code.MemberDeclCodeDOM[];

        protected buildStringFieldCode(prop: UserProperty, value: string) {

            const decl = new code.FieldDeclCodeDOM(prop.getInfo().name, "string", true);

            decl.setInitialValueExpr(code.CodeDOM.quote(value));

            return decl;
        }

        protected buildNumberFieldCode(prop: UserProperty, value: number) {

            const decl = new code.FieldDeclCodeDOM(prop.getInfo().name, "number", true);

            decl.setInitialValueExpr(value.toString());

            return decl;
        }
    }
}