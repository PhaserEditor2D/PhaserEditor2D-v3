namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;
    import io = colibri.core.io;
    import UserComponent = editor.usercomponent.UserComponent;

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

            const data = ser.getData() as core.json.IObjectData;

            data.components = [...this._compNames];

            // we don't want to serialize an empty components array,
            // if it is the case, we exclude it from the file
            if (data.components.length === 0) {

                delete data.components;
            }

            for (const compName of this._compNames) {

                const key = this.getPropertyKey(compName, "export");

                const exported = this.isExportComponent(compName);

                colibri.core.json.write(ser.getData(), key, exported, true);
            }

            super.writeJSON(ser);
        }

        readJSON(ser: core.json.Serializer) {

            const data = ser.getData() as core.json.IObjectData;

            this._compNames = data.components || [];

            for (const compName of this._compNames) {

                const key = this.getPropertyKey(compName, "export");

                const exported = colibri.core.json.read(ser.getData(), key, true);

                this.setExportComponent(compName, exported);
            }

            super.readJSON(ser);
        }

        writeProperty(ser: core.json.Serializer, prop: IProperty<any>) {

            if (prop instanceof UserComponentPropertyWrapper) {

                // This may happen when you add a user component to a prefab instance.
                // in that case, the properties are local.
                // But if the user property is inherited from the prefab, then it is not local.
                const local = this.getEditorSupport().isLocalUserProperty(prop);

                super.writeProperty(ser, prop, local);

                return;
            }

            super.writeProperty(ser, prop);
        }

        setExportComponent(compName: string, isExport: boolean) {

            this._propData[this.getPropertyKey(compName, "export")] = isExport;
        }

        isExportComponent(compName: string) {

            const val = this._propData[this.getPropertyKey(compName, "export")] ?? true;

            return val;
        }

        isComponentPublished(compName: string) {

            const objES = this.getEditorSupport();

            if (objES.isPrefabInstance()) {

                return this.isComponentAvailabeInPrefab(compName, objES.getPrefabId());
            }

            return this.hasLocalUserComponent(compName);
        }

        private isComponentAvailabeInPrefab(compName: string, prefabId: string) {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const data = finder.getPrefabData(prefabId);

            const key = this.getPropertyKey(compName, "export");

            if (key in data) {

                return data[key];
            }

            if (data.prefabId) {

                return this.isComponentAvailabeInPrefab(compName, data.prefabId);
            }

            return true;
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

                delete this._propData[this.getPropertyKey(compName, "export")];
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

        private _userCompMap: Map<string, UserComponentNode> = new Map();

        getUserComponentNodes() {

            const obj = this.getObject();

            const result: UserComponentNode[] = [];

            // build local components

            const localComponents = this.getLocalUserComponents();

            for (const findCompResult of localComponents) {

                const node = this.getUserComponentNodeFor(obj, findCompResult.component);

                result.push(node);
            }

            // build prefab components

            const compAndPrefabList = this.getPrefabUserComponents();

            for (const compAndPrefab of compAndPrefabList) {

                for (const comp of compAndPrefab.components) {

                    const node = this.getUserComponentNodeFor(obj, comp, compAndPrefab.prefabFile);

                    result.push(node);
                }
            }

            return result;
        }

        private getUserComponentNodeFor(obj: ISceneGameObject, userComponent: UserComponent, prefabFile?: io.FilePath) {

            const key = UserComponentNode.computeKey(obj, userComponent, prefabFile);

            if (this._userCompMap.has(key)) {

                return this._userCompMap.get(key);
            }

            const node = new UserComponentNode(obj, userComponent, prefabFile);

            this._userCompMap.set(key, node);

            return node;
        }

        getLocalUserComponents(): core.json.IFindComponentResult[] {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            return this._compNames

                .map(compName => finder.getUserComponentByName(compName))

                .filter(c => c !== undefined);
        }

        getPrefabUserComponents(): IUserComponentAndPrefab[] {

            const result: IUserComponentAndPrefab[] = [];

            const objES = this.getObject().getEditorSupport();

            if (objES.isPrefabInstance()) {

                this.getUserComponentsOfPrefab(objES.getPrefabId(), result);
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

                if (objData.prefabId) {

                    this.getUserComponentsOfPrefab(objData.prefabId, result);
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

        private formatComponentVarName(name: string) {

            return name.replaceAll(".", "_");
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            const allPropsStart = args.lazyStatements.length;

            const finder = ScenePlugin.getInstance().getSceneFinder();

            for (const compName of this._compNames) {

                const compInfo = finder.getUserComponentByName(compName);

                if (compInfo) {

                    const compVarName = this.formatComponentVarName(args.objectVarName + compName);

                    const compPropsStart = args.lazyStatements.length;

                    this.buildSetObjectPropertiesCodeDOM2(compInfo.component, compName, compVarName, args);

                    args.lazyStatements.splice(compPropsStart, 0,

                        new code.RawCodeDOM(

                            compPropsStart === args.lazyStatements.length ?

                                `new ${compName}(${args.objectVarName});`

                                : `const ${compVarName} = new ${compName}(${args.objectVarName});`
                        ));

                    const { importPath, asDefault } = code.getImportPath(args.sceneFile, new io.FilePath(compInfo.file.getParent(), {
                        isFile: true,
                        modTime: 0,
                        name: compName,
                        size: 0,
                        children: []
                    }));

                    args.unit.addImport(compName, importPath, asDefault);
                }
            }

            const prefabUserComponents = this.getPrefabUserComponents();

            for (const prefabUserComps of prefabUserComponents) {

                for (const comp of prefabUserComps.components) {

                    const compName = comp.getName();

                    const compVarName = this.formatComponentVarName(args.objectVarName + compName);

                    const prefabPropsStart = args.lazyStatements.length;

                    this.buildSetObjectPropertiesCodeDOM2(comp, compName, compVarName, args);

                    if (prefabPropsStart !== args.lazyStatements.length) {

                        args.lazyStatements.splice(prefabPropsStart, 0,
                            new code.RawCodeDOM(
                                `const ${compVarName} = ${compName}.getComponent(${args.objectVarName});`));

                        const compInfo = finder.getUserComponentByName(compName);

                        const importData = code.getImportPath(args.sceneFile, new io.FilePath(compInfo.file.getParent(), {
                            isFile: true,
                            modTime: 0,
                            name: compName,
                            size: 0,
                            children: []
                        }));

                        args.unit.addImport(compName, importData.importPath, importData.asDefault);
                    }
                }
            }

            if (allPropsStart !== args.lazyStatements.length) {

                args.lazyStatements.splice(allPropsStart, 0,
                    new code.RawCodeDOM(""),
                    new code.RawCodeDOM(`// ${args.objectVarName} (components)`));
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