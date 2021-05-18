namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;
    import io = colibri.core.io;

    export interface IUserComponentAndPrefab {
        prefabFile: io.FilePath;
        components: editor.usercomponent.UserComponent[];
    }

    export class UserComponentsEditorComponent extends Component<ISceneGameObject> {

        private _propData: any;
        private _compNames: string[];

        constructor(obj: ISceneGameObject) {
            super(obj, []);

            this._propData = {};
            this._compNames = [];
        }

        writeJSON(ser: core.json.Serializer) {

            ser.getData()["components"] = [...this._compNames];

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

        moveUpUserComponent(compName: string) {

            const i = this._compNames.indexOf(compName);

            if (i > 0) {

                const temp = this._compNames[i - 1];
                this._compNames[i - 1] = compName;
                this._compNames[i] = temp;
            }
        }

        moveDownUserComponent(compName: string) {

            const i = this._compNames.indexOf(compName);

            const lastIndex = this._compNames.length - 1;

            if (i >= 0 && i < lastIndex) {

                const temp = this._compNames[i + 1];
                this._compNames[i + 1] = compName;
                this._compNames[i] = temp;
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

            const allPropsStart = args.lazyStatements.length;

            const finder = ScenePlugin.getInstance().getSceneFinder();

            for (const compName of this._compNames) {

                const compInfo = finder.getUserComponentByName(compName);

                if (compInfo) {

                    const compVarName = args.objectVarName + compName;

                    const compPropsStart = args.lazyStatements.length;

                    this.buildSetObjectPropertiesCodeDOM2(compInfo.component, compName, compVarName, args);

                    args.lazyStatements.splice(compPropsStart, 0,

                        new code.RawCodeDOM(

                            compPropsStart === args.lazyStatements.length ?

                                `new ${compName}(${args.objectVarName});`

                                : `const ${compVarName} = new ${compName}(${args.objectVarName});`
                        ));

                    const filePath = code.getImportPath(args.sceneFile, new io.FilePath(compInfo.file.getParent(), {
                        isFile: true,
                        modTime: 0,
                        name: compName,
                        size: 0,
                        children: []
                    }));

                    args.unit.addImport(compName, filePath);
                }
            }
            const prefabUserComponents = this.getPrefabUserComponents();

            for (const prefabUserComps of prefabUserComponents) {

                for (const comp of prefabUserComps.components) {

                    const compName = comp.getName();

                    const compVarName = args.objectVarName + compName;

                    const prefabPropsStart = args.lazyStatements.length;

                    this.buildSetObjectPropertiesCodeDOM2(comp, compName, compVarName, args);

                    if (prefabPropsStart !== args.lazyStatements.length) {

                        args.lazyStatements.splice(prefabPropsStart, 0,
                            new code.RawCodeDOM(
                                `const ${compVarName} = ${compName}.getComponent(${args.objectVarName});`));

                        const compInfo = finder.getUserComponentByName(compName);

                        const filePath = code.getImportPath(args.sceneFile, new io.FilePath(compInfo.file.getParent(), {
                            isFile: true,
                            modTime: 0,
                            name: compName,
                            size: 0,
                            children: []
                        }));

                        args.unit.addImport(compName, filePath);
                    }
                }
            }

            const isScenePrefabObject = this.getObject().getEditorSupport().isScenePrefabObject();
            const hasUserComponents = this._compNames.length > 0 || prefabUserComponents.length > 0;
            const emitAwake = !isScenePrefabObject && hasUserComponents;


            if (allPropsStart !== args.lazyStatements.length || emitAwake) {

                args.lazyStatements.splice(allPropsStart, 0,
                    new code.RawCodeDOM(""),
                    new code.RawCodeDOM(`// ${args.objectVarName} (components)`));
            }

            if (emitAwake) {

                const stmt = new code.MethodCallCodeDOM("emit", args.objectVarName);
                stmt.argLiteral("components-awake");

                args.lazyStatements.push(stmt);
            }
        }

        private buildSetObjectPropertiesCodeDOM2(comp: editor.usercomponent.UserComponent, compName: string, compVarName: string, args: ISetObjectPropertiesCodeDOMArgs) {

            const temp = args.statements;
            args.statements = args.lazyStatements;

            const props = comp.getUserProperties().getProperties();

            if (props.length > 0) {

                const objVarName = args.objectVarName;

                for (const userProp of props) {

                    args.objectVarName = compVarName;

                    userProp.getType().buildSetObjectPropertyCodeDOM(this, args, userProp);
                }

                args.objectVarName = objVarName;
            }

            args.statements = temp;
        }
    }
}