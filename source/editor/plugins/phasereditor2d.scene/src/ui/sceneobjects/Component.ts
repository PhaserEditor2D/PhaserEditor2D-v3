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

        getExplicitTypesForMethodFactory(): string | undefined {

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
            codeDomBuilder: (builderArgs: { prop: IProperty<T>, fieldCodeName: string, value: any }) => void) {

            for (const prop of properties) {

                const fieldCodeName = prop.codeName ?? prop.name;
                const value = prop.getValue(this.getObject());

                let local = true;

                if (this.getEditorSupport().isPrefabInstance()) {

                    local = false;

                    if (prop instanceof UserComponentPropertyWrapper) {

                        local = this.getEditorSupport().isLocalUserProperty(prop);
                    }

                    if (!local) {

                        if (this.getEditorSupport().isUnlockedProperty(prop)) {

                            codeDomBuilder({ prop, fieldCodeName, value });
                        }
                    }
                }

                if (local) {

                    const defValue = this.getPropertyDefaultValue(prop);

                    if (value !== defValue) {

                        codeDomBuilder({ prop, fieldCodeName, value });
                    }
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