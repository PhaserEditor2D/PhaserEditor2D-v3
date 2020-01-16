namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export interface ISetObjectPropertiesCodeDOMArgs {
        result: core.code.CodeDOM[];
        objectVarName: string;
        prefabSerializer: core.json.Serializer;
    }

    export abstract class Component<T> implements core.json.ISerializable {

        private _obj: T;

        constructor(obj: T) {
            this._obj = obj;
        }

        getObject() {
            return this._obj;
        }

        protected buildSetObjectPropertyCodeDOM_Float(
            fieldName: string, value: number, defValue: number, args: ISetObjectPropertiesCodeDOMArgs): void {

            const dom = new code.AssignPropertyCodeDOM(fieldName, args.objectVarName);
            let add = false;

            if (args.prefabSerializer) {

                add = value !== args.prefabSerializer.read(fieldName, defValue);

            } else {

                add = value !== defValue;
            }

            if (add) {

                dom.valueFloat(value);
                args.result.push(dom);
            }
        }

        async buildDependenciesHash(args: IBuildDependencyHashArgs) {

            // nothing by default
        }

        abstract buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void;

        abstract writeJSON(ser: core.json.Serializer): void;

        abstract readJSON(ser: core.json.Serializer): void;
    }
}