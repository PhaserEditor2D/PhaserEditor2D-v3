namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;
    import read = colibri.core.json.read;
    import write = colibri.core.json.write;

    export interface ISetObjectPropertiesCodeDOMArgs {
        result: core.code.CodeDOM[];
        objectVarName: string;
        prefabSerializer: core.json.Serializer;
    }

    export abstract class Component<T> implements core.json.ISerializable {

        private _obj: T;
        private _properties: Set<IProperty<any>>;

        constructor(obj: T, properties: Array<IProperty<any>>) {

            this._obj = obj;
            this._properties = new Set(properties);
        }

        adjustAfterTypeChange(originalObject: ISceneObject): void {
            //
        }

        getProperties() {
            return this._properties;
        }

        getObject() {
            return this._obj;
        }

        write(ser: core.json.Serializer, ...properties: Array<IProperty<T>>) {

            for (const prop of properties) {

                ser.write(prop.name, prop.getValue(this._obj), prop.defValue);
            }
        }

        read(ser: core.json.Serializer, ...properties: Array<IProperty<T>>) {

            for (const prop of properties) {

                const value = ser.read(prop.name, prop.defValue);

                prop.setValue(this._obj, value);
            }
        }

        writeLocal(ser: core.json.Serializer, ...properties: Array<IProperty<T>>) {

            for (const prop of properties) {

                write(ser.getData(), prop.name, prop.getValue(this._obj), prop.defValue);
            }
        }

        readLocal(ser: core.json.Serializer, ...properties: Array<IProperty<T>>) {

            for (const prop of properties) {

                const value = read(ser.getData(), prop.name, prop.defValue);

                prop.setValue(this._obj, value);
            }
        }

        protected buildSetObjectPropertyCodeDOM_FloatProperty(

            args: ISetObjectPropertiesCodeDOMArgs, ...properties: Array<IProperty<T>>) {

            for (const prop of properties) {

                this.buildSetObjectPropertyCodeDOM_Float(
                    prop.name,
                    prop.getValue(this.getObject()),
                    prop.defValue,
                    args
                );
            }
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

        writeJSON(ser: core.json.Serializer) {

            for (const prop of this._properties) {

                if (prop.local) {

                    this.writeLocal(ser, prop);

                } else {

                    this.write(ser, prop);
                }
            }
        }

        readJSON(ser: core.json.Serializer) {

            for (const prop of this._properties) {

                if (prop.local) {

                    this.readLocal(ser, prop);

                } else {

                    this.read(ser, prop);
                }
            }
        }
    }
}