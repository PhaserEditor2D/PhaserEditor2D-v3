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
        sceneFile: io.FilePath,
        obj: ISceneGameObject
    }

    export interface IBuildPrefabExtraTypeScriptDefinitionsCodeDOMArgs {
        unit: code.UnitCodeDOM;
        clsName: string;
        prefabObj: ISceneGameObject
    }

    export abstract class Component<T extends ISceneGameObject> implements core.json.ISerializable {

        private _obj: T;
        private _properties: Set<IProperty<any>>;
        private _active: boolean;
        private _activeDefaultValue: boolean;

        constructor(obj: T, properties: Array<IProperty<any>>, activeDefaultValue = true) {

            this._obj = obj;
            this._properties = new Set(properties);
            this._active = activeDefaultValue;
            this._activeDefaultValue = activeDefaultValue;
        }

        isActive() {

            return this._active;
        }

        setActive(active: boolean) {

            this._active = active;
        }

        getExplicitTypesForMethodFactory(baseType: string): string | undefined {

            return undefined;
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

                const value = prop.getValue(this._obj);

                const defValue = this.getPropertyDefaultValue(prop);
                
                ser.write(prop.name, value, defValue);
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

            this.helperBuildSetObjectPropertyCodeDOM_StringProperty(args, properties, true);
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
            codeDomBuilder: (builderArgs: { prop: IProperty<T>, fieldCodeName: string, value: any }) => void,
            onPropertyIgnored?: (builderArgs: { prop: IProperty<T>, fieldCodeName: string, value: any }) => void) {

            const objES = this.getEditorSupport();

            for (const prop of properties) {

                const fieldCodeName = prop.codeName ?? prop.name;
                const value = prop.getValue(this.getObject());
                const builderArgs = { prop, fieldCodeName, value };

                let local = true;
                let skip = true;

                if (objES.isPrefabInstance()) {

                    local = false;

                    if (prop instanceof UserComponentPropertyWrapper) {

                        local = objES.isLocalUserProperty(prop);
                    }

                    if (!local) {

                        if (objES.isUnlockedProperty(prop)) {

                            skip = false;
                            codeDomBuilder(builderArgs);
                        }
                    }
                }

                if (local) {

                    const defValue = this.getPropertyDefaultValue(prop);

                    if (value !== defValue) {

                        skip = false;
                        codeDomBuilder(builderArgs);
                    }
                }

                if (skip && onPropertyIgnored) {

                    onPropertyIgnored(builderArgs);
                }
            }
        }

        buildSetObjectPropertyXYCodeDOM(
            propXY: IPropertyXY,
            codeDomBuilder: (builderArgs: { propXY: IPropertyXY, x: any, y: any }) => void) {

            const obj = this.getObject();

            const x = propXY.x.getValue(obj);
            const y = propXY.y.getValue(obj);

            let gen = false;

            if (this.getEditorSupport().isPrefabInstance()) {

                gen = this.getEditorSupport().isUnlockedPropertyXY(propXY);

            } else {

                const defaultX = this.getPropertyDefaultValue(propXY.x);
                const defaultY = this.getPropertyDefaultValue(propXY.y);

                gen = x !== defaultX || y !== defaultY;
            }

            if (gen) {

                codeDomBuilder({ propXY, x, y });
            }
        }

        buildSetObjectPropertyXYCodeDOM_FloatXY(args: ISetObjectPropertiesCodeDOMArgs,
            propXY: IPropertyXY) {

            this.buildSetObjectPropertyXYCodeDOM(propXY, args2 => {

                const dom = new code.MethodCallCodeDOM(propXY.setterName, args.objectVarName);

                dom.argFloat(args2.x);
                dom.argFloat(args2.y);

                args.statements.push(dom);
            });
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

        buildSetObjectPropertiesWithMethodCodeDOM_FloatProperty(
            args: ISetObjectPropertiesCodeDOMArgs,
            methodName: string,
            ...properties: Array<IProperty<T>>) {

            const values: string[] = [];
            const generateCode = { yes: false };

            this.buildSetObjectPropertyCodeDOM(properties, args2 => {

                const codeValue = args2.prop.valueToCodeConverter ? args2.prop.valueToCodeConverter(args2.value) : args2.value;

                values.push(codeValue);

                generateCode.yes = true;

            }, args2 => {

                values.push(`${args.objectVarName}.${args2.fieldCodeName}`);
            });

            if (generateCode.yes) {

                const dom = new code.MethodCallCodeDOM(methodName, args.objectVarName);

                for (const value of values) {

                    dom.arg(value);
                }

                args.statements.push(dom);
            }
        }

        /**
        * Build extra typescript definitions at the top of the file.
        * 
        * @param args This method args.
        */
        buildPrefabTypeScriptDefinitionsCodeDOM(args: IBuildPrefabExtraTypeScriptDefinitionsCodeDOMArgs) {
            // nothing by default
        }

        async buildDependenciesHash(args: IBuildDependencyHashArgs) {
            // nothing by default
        }

        abstract buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void;

        getComponentName() {

            return this.constructor.name;
        }

        writeJSON(ser: core.json.Serializer) {

            ser.write(`${this.getComponentName()}.active`, this._active, this._activeDefaultValue);

            if (this._active) {

                for (const prop of this.getProperties()) {

                    this.writeProperty(ser, prop);
                }
            }
        }

        protected writeProperty(ser: core.json.Serializer, prop: IProperty<T>, local?: boolean) {

            local = local ?? prop.local;

            if (local) {

                this.writeLocal(ser, prop);

            } else {

                this.write(ser, prop);
            }
        }

        readJSON(ser: core.json.Serializer) {

            this._active = ser.read(`${this.getComponentName()}.active`, this._activeDefaultValue);

            if (this._active) {

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
}