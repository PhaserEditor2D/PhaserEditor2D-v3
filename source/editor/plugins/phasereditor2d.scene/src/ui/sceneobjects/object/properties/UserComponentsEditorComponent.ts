namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class UserComponentsEditorComponent extends Component<ISceneObject> {

        private _propData: any;
        private _compNames: string[];

        constructor(obj: ISceneObject) {
            super(obj, []);

            this._propData = {};
            this._compNames = [];
        }

        writeJSON(ser: core.json.Serializer) {

            ser.getData()["components"] = this._compNames;

            super.writeJSON(ser);
        }

        readJSON(ser: core.json.Serializer) {

            this._compNames = ser.getData()["components"] || [];

            super.readJSON(ser);
        }

        setPropertyValue(compName: string, prop: UserProperty, value: any) {

            this._propData[`${compName}.${prop.getName()}`] = value;
        }

        getPropertyValue(compName: string, prop: UserProperty) {

            return this._propData[`${compName}.${prop.getName()}`];
        }

        isPropertySet(compName: string, prop: UserProperty) {

            return `${compName}.${prop.getName()}` in this._propData;
        }

        addUserComponent(compName: string) {

            this._compNames.push(compName);
        }

        getUserComponents() {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            return this._compNames

                .map(compName => finder.getUserComponentByName(compName))

                .filter(c => c !== undefined);
        }

        getProperties() {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const properties = this._compNames

                .map(compName => finder.getUserComponentByName(compName))

                .filter(c => c !== undefined)

                .flatMap(c => c.comp.getUserProperties().getProperties())

                .flatMap(p => p.getComponentProperty());

            return new Set(properties);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            for (const compName of this._compNames) {

                const info = finder.getUserComponentByName(compName);

                if (info) {

                    const compVarName = args.objectVarName + compName;

                    const newCompDom = new code.RawCodeDOM(`const ${compVarName} = new ${compName}(${args.objectVarName});`);

                    args.result.push(newCompDom);

                    for (const userProp of info.comp.getUserProperties().getProperties()) {

                        const originalVarName = args.objectVarName;

                        args.objectVarName = compVarName;

                        userProp.getType().buildSetObjectPropertyCodeDOM(this, args, userProp);

                        args.objectVarName = originalVarName;
                    }
                }
            }
        }
    }
}