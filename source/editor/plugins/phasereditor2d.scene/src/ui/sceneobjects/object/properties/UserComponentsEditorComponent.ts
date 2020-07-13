namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;
    import io = colibri.core.io;

    export interface IUserComponentAndPrefab {
        prefabFile: io.FilePath;
        components: editor.usercomponent.UserComponent[];
    }

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

            this._propData[this.getPropertyKey(compName, prop.getName())] = value;
        }

        getPropertyValue(compName: string, prop: UserProperty) {

            return this._propData[this.getPropertyKey(compName, prop.getName())];
        }

        isPropertySet(compName: string, prop: UserProperty) {

            return this.getPropertyKey(compName, prop.getName()) in this._propData;
        }

        hasLocalUserComponent(compName: string) {

            return this._compNames.indexOf(compName) >= 0;
        }

        hasUserComponent(compName: string) {

            if (this.hasLocalUserComponent(compName)) {

                return true;
            }

            const find = this.getPrefabUserComponents()

                .flatMap(info => info.components)

                .find(c => c.getName() === compName);

            return find !== undefined;
        }

        addUserComponent(compName: string) {

            this._compNames.push(compName);
        }

        removeUserComponent(compName: string) {

            this._compNames = this._compNames.filter(name => name !== compName);

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const compInfo = finder.getUserComponentByName(compName);

            if (compInfo) {

                for (const prop of compInfo.component.getUserProperties().getProperties()) {

                    delete this._propData[this.getPropertyKey(compName, prop.getName())];
                }
            }
        }

        private getPropertyKey(compName: string, propName: string) {

            return `${compName}.${propName}`;
        }

        getUserComponents() {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            return this._compNames

                .map(compName => finder.getUserComponentByName(compName))

                .filter(c => c !== undefined);
        }

        getPrefabUserComponents() {

            const result: IUserComponentAndPrefab[] = [];

            const support = this.getObject().getEditorSupport();

            if (support.isPrefabInstance()) {

                const objData = support.getPrefabData();

                if (objData) {

                    if (objData.components) {

                        this.getUserComponentsOfPrefab(support.getPrefabId(), result);
                    }
                }
            }

            return result;
        }

        private getUserComponentsOfPrefab(prefabId: string, result: IUserComponentAndPrefab[]) {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const prefabFile = finder.getPrefabFile(prefabId);

            const objData = finder.getPrefabData(prefabId);

            if (objData) {

                if (objData.components) {

                    const components = objData.components

                        .map(compName => finder.getUserComponentByName(compName))

                        .filter(info => info !== undefined)

                        .map(info => info.component);

                    if (components.length > 0) {

                        result.push({ prefabFile, components })
                    }
                }
            }
        }

        getProperties() {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const compNames = [...this._compNames];

            compNames.push(...this.getPrefabUserComponents()

                .flatMap(info => info.components)

                .map(c => c.getName()));

            const properties = compNames

                .map(compName => finder.getUserComponentByName(compName))

                .filter(c => c !== undefined)

                .flatMap(c => c.component.getUserProperties().getProperties())

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

                    this.buildSetObjectPropertiesCodeDOM2(info.component, compVarName, args);
                }
            }

            for (const info of this.getPrefabUserComponents()) {

                for (const comp of info.components) {

                    const compName = comp.getName();

                    const compVarName = args.objectVarName + compName;

                    const newCompDom = new code.RawCodeDOM(`const ${compVarName} = ${compName}.getComponent(${args.objectVarName});`);

                    args.result.push(newCompDom);

                    this.buildSetObjectPropertiesCodeDOM2(comp, compVarName, args);
                }
            }
        }

        private buildSetObjectPropertiesCodeDOM2(comp: editor.usercomponent.UserComponent, compVarName: string, args: ISetObjectPropertiesCodeDOMArgs) {

            const support = this.getObject().getEditorSupport();

            for (const userProp of comp.getUserProperties().getProperties()) {

                const originalVarName = args.objectVarName;

                args.objectVarName = compVarName;

                userProp.getType().buildSetObjectPropertyCodeDOM(this, args, userProp);

                args.objectVarName = originalVarName;
            }
        }
    }
}