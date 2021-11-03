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

    export abstract class Component<T extends ISceneGameObjectLike> implements core.json.ISerializable {

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

        getEditorSupport() {

            return this._obj.getEditorSupport();
        }

        getPropertyDefaultValue(prop: IProperty<any>) {

            return this.getEditorSupport().getPropertyDefaultValue(prop);
        }

        write(ser: core.json.Serializer, ...properties: Array<IProperty<T>>) {

            for (const prop of properties) {

                ser.write(prop.name, prop.getValue(this._obj), this.getPropertyDefaultValue(prop));
            }
        }

        read(ser: core.json.Serializer, ...properties: Array<IProperty<T>>) {

            for (const prop of properties) {

                const value = ser.read(prop.name, this.getPropertyDefaultValue(prop));

                prop.setValue(this._obj, value);
            }
        }

        writeLocal(ser: core.json.Serializer, ...properties: Array<IProperty<T>>) {

            for (const prop of properties) {

                write(ser.getData(), prop.name, prop.getValue(this._obj), this.getPropertyDefaultValue(prop));
            }
        }

        readLocal(ser: core.json.Serializer, ...properties: Array<IProperty<T>>) {

            for (const prop of properties) {

                const value = read(ser.getData(), prop.name, this.getPropertyDefaultValue(prop));

                prop.setValue(this._obj, value);
            }
        }

        helperBuildSetObjectPropertyCodeDOM_StringProperty(
            args: ISetObjectPropertiesCodeDOMArgs, properties: Array<IProperty<T>>, verbatim: boolean) {

            this.buildSetObjectPropertyCodeDOM(properties, args2 => {

                const dom = new code.AssignPropertyCodeDOM(args2.fieldCodeName, args.objectVarName);

                if (verbatim) {

                    dom.value(args2.value);

                } else {

                    dom.valueLiteral(args2.value);
                }

                args.statements.push(dom);
            });
        }

        buildSetObjectPropertyCodeDOM_StringProperty(
            args: ISetObjectPropertiesCodeDOMArgs, ...properties: Array<IProperty<T>>) {

            this.helperBuildSetObjectPropertyCodeDOM_StringProperty(args, properties, false);
        }

        buildSetObjectPropertyCodeDOM_StringVerbatimProperty(

            args: ISetObjectPropertiesCodeDOMArgs, ...properties: Array<IProperty<T>>) {

            this.helperBuildSetObjectPropertyCodeDOM_StringProperty(args, properties, false);
        }

        buildSetObjectPropertyCodeDOM_BooleanProperty(

            args: ISetObjectPropertiesCodeDOMArgs, ...properties: Array<IProperty<T>>) {

            this.buildSetObjectPropertyCodeDOM(properties, args2 => {

                const dom = new code.AssignPropertyCodeDOM(args2.fieldCodeName, args.objectVarName);

                dom.valueBool(args2.value);

                args.statements.push(dom);

            });
        }

        buildSetObjectPropertyCodeDOM(
            properties: Array<IProperty<T>>,
            codeDomBuilder: (builderArgs: { prop: IProperty<T>, fieldCodeName: string, value: any }) => void) {

            for (const prop of properties) {

                const fieldCodeName = prop.codeName ?? prop.name;
                const value = prop.getValue(this.getObject());
                const defValue = this.getPropertyDefaultValue(prop);

                if (this.getEditorSupport().isPrefabInstance()) {

                    if (this.getEditorSupport().isUnlockedProperty(prop)) {

                        codeDomBuilder({ prop, fieldCodeName, value });
                    }

                } else {

                    if (value !== defValue) {

                        codeDomBuilder({ prop, fieldCodeName, value });
                    }
                }
            }
        }

        buildSetObjectPropertyCodeDOM_FloatProperty(

            args: ISetObjectPropertiesCodeDOMArgs, ...properties: Array<IProperty<T>>) {

            this.buildSetObjectPropertyCodeDOM(properties, args2 => {

                const dom = new code.AssignPropertyCodeDOM(args2.fieldCodeName, args.objectVarName);

                const codeValue = args2.prop.valueToCodeConverter ? args2.prop.valueToCodeConverter(args2.value) : args2.value;

                dom.valueFloat(codeValue);

                args.statements.push(dom);

            });
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