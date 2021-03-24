namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;
    import io = colibri.core.io;
    import read = colibri.core.json.read;
    import write = colibri.core.json.write;

    export interface ISetObjectPropertiesCodeDOMArgs {
        statements: core.code.CodeDOM[];
        lazyStatements: core.code.CodeDOM[];
        objectVarName: string;
        prefabSerializer: core.json.Serializer;
        unit: core.code.UnitCodeDOM;
        sceneFile: io.FilePath
    }

    export abstract class Component<T> implements core.json.ISerializable {

        private _obj: T;
        private _properties: Set<IProperty<any>>;

        constructor(obj: T, properties: Array<IProperty<any>>) {

            this._obj = obj;
            this._properties = new Set(properties);
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

        buildSetObjectPropertyCodeDOM_String(
            fieldName: string, fieldCodeName: string, value: string, defValue: string, args: ISetObjectPropertiesCodeDOMArgs, verbatim = false): void {

            const dom = new code.AssignPropertyCodeDOM(fieldCodeName, args.objectVarName);
            let add = false;

            if (args.prefabSerializer) {

                add = value !== args.prefabSerializer.read(fieldName, defValue);

            } else {

                add = value !== defValue;
            }

            if (add) {

                if (verbatim) {

                    dom.value(value);

                } else {

                    dom.valueLiteral(value);
                }

                args.statements.push(dom);
            }
        }

        buildSetObjectPropertyCodeDOM_StringProperty(

            args: ISetObjectPropertiesCodeDOMArgs, ...properties: Array<IProperty<T>>) {

            for (const prop of properties) {

                this.buildSetObjectPropertyCodeDOM_String(
                    prop.name,
                    prop.codeName || prop.name,
                    prop.getValue(this.getObject()),
                    prop.defValue,
                    args
                );
            }
        }

        buildSetObjectPropertyCodeDOM_StringVerbatimProperty(

            args: ISetObjectPropertiesCodeDOMArgs, ...properties: Array<IProperty<T>>) {

            for (const prop of properties) {

                this.buildSetObjectPropertyCodeDOM_String(
                    prop.name,
                    prop.codeName || prop.name,
                    prop.getValue(this.getObject()),
                    prop.defValue,
                    args,
                    true
                );
            }
        }

        buildSetObjectPropertyCodeDOM_BooleanProperty(

            args: ISetObjectPropertiesCodeDOMArgs, ...properties: Array<IProperty<T>>) {

            for (const prop of properties) {

                this.buildSetObjectPropertyCodeDOM_Boolean(
                    prop.name,
                    prop.codeName || prop.name,
                    prop.getValue(this.getObject()),
                    prop.defValue,
                    args
                );
            }
        }

        buildSetObjectPropertyCodeDOM_Boolean(
            fieldName: string, fieldCodeName: string, value: boolean, defValue: boolean, args: ISetObjectPropertiesCodeDOMArgs): void {

            const dom = new code.AssignPropertyCodeDOM(fieldCodeName, args.objectVarName);
            let add = false;

            if (args.prefabSerializer) {

                add = value !== args.prefabSerializer.read(fieldName, defValue);

            } else {

                add = value !== defValue;
            }

            if (add) {

                dom.valueBool(value);
                args.statements.push(dom);
            }
        }

        buildSetObjectPropertyCodeDOM_FloatProperty(

            args: ISetObjectPropertiesCodeDOMArgs, ...properties: Array<IProperty<T>>) {

            for (const prop of properties) {

                this.buildSetObjectPropertyCodeDOM_Float(
                    prop.name,
                    prop.codeName || prop.name,
                    prop.getValue(this.getObject()),
                    prop.defValue,
                    args
                );
            }
        }

        buildSetObjectPropertyCodeDOM_Float(
            fieldName: string, fieldCodeName: string, value: number, defValue: number, args: ISetObjectPropertiesCodeDOMArgs): void {

            const dom = new code.AssignPropertyCodeDOM(fieldCodeName, args.objectVarName);

            const add = this.hasValueForIncludeInCode(fieldName, value, defValue, args);

            if (add) {

                dom.valueFloat(value);
                args.statements.push(dom);
            }
        }

        hasValueForIncludeInCode(fieldName: string, value: number, defValue: number, args: ISetObjectPropertiesCodeDOMArgs) {

            if (args.prefabSerializer) {

                const prefabValue = args.prefabSerializer.read(fieldName, defValue);

                return value !== prefabValue;

            }

            return value !== defValue;
        }

        async buildDependenciesHash(args: IBuildDependencyHashArgs) {

            // nothing by default
        }

        abstract buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void;

        writeJSON(ser: core.json.Serializer) {

            for (const prop of this.getProperties()) {

                if (prop.local) {

                    this.writeLocal(ser, prop);

                } else {

                    this.write(ser, prop);
                }
            }
        }

        readJSON(ser: core.json.Serializer) {

            for (const prop of this.getProperties()) {

                if (prop.local) {

                    this.readLocal(ser, prop);

                } else {

                    this.read(ser, prop);
                }
            }
        }
    }
}