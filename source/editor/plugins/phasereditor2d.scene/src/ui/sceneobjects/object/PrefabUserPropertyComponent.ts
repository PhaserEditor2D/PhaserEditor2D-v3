namespace phasereditor2d.scene.ui.sceneobjects {

    import io = colibri.core.io;

    export interface IUserPropertiesInObject {

        prefabFile: colibri.core.io.FilePath;
        properties: UserProperty[];
    }

    export class PrefabUserPropertyComponent extends Component<ISceneGameObject> {

        private _data: any;

        constructor(obj: ISceneGameObject) {
            super(obj, []);

            this._data = {};
        }

        setPropertyValue(prop: UserProperty, value: any) {

            this._data[prop.getName()] = value;
        }

        getPropertyValue(prop: UserProperty) {

            return this._data[prop.getName()];
        }

        isPropertySet(prop: UserProperty) {

            return prop.getName() in this._data;
        }

        getPropertiesByPrefab() {

            const propertiesInObject: IUserPropertiesInObject[] = [];

            const objES = this.getObject().getEditorSupport();

            const finder = ScenePlugin.getInstance().getSceneFinder();

            if (objES.isPrefabInstance()) {

                // get all from the nested prefabs chain

                if (objES.isNestedPrefabInstance()) {

                    this.getNestedPrefabProperties(propertiesInObject, objES.getPrefabId());
                }

                // get all from non-nested prefab hierarchy

                const nextPrefabId = finder.getFirstNonNestedPrefabId(objES.getPrefabId());

                if (nextPrefabId) {

                    const prefabFile = finder.getPrefabFile(nextPrefabId);

                    if (prefabFile) {

                        this.getPrefabProperties(propertiesInObject, prefabFile);
                    }
                }
            }

            return propertiesInObject;
        }

        private getNestedPrefabProperties(propertiesInObject: IUserPropertiesInObject[],
            nestedPrefabId: string) {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const prefabFile = finder.getPrefabFile(nestedPrefabId);

            propertiesInObject.push({
                prefabFile,
                properties: []
            });

            const data = finder.getPrefabData(nestedPrefabId);

            nestedPrefabId = data.prefabId;

            if (nestedPrefabId && finder.isNestedPrefab(nestedPrefabId)) {

                this.getNestedPrefabProperties(propertiesInObject, data.prefabId);
            }
        }

        private getPrefabProperties(propertiesInObject: IUserPropertiesInObject[], prefabFile: io.FilePath) {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const sceneData = finder.getSceneData(prefabFile);

            if (sceneData.sceneType === core.json.SceneType.PREFAB) {

                if (sceneData.displayList.length > 0) {

                    const objData = sceneData.displayList[sceneData.displayList.length - 1] as core.json.IObjectData;

                    if (objData.prefabId) {

                        const prefabFile2 = finder.getPrefabFile(objData.prefabId);

                        if (prefabFile2) {

                            this.getPrefabProperties(propertiesInObject, prefabFile2);
                        }
                    }
                }
            }

            const userProps = new PrefabUserProperties();

            userProps.readJSON(sceneData.prefabProperties || []);

            const properties = userProps.getProperties();

            propertiesInObject.push({
                prefabFile,
                properties
            });
        }

        getProperties() {

            const properties = this.getPropertiesByPrefab()

                .flatMap(data => data.properties)

                .map(userProp => userProp.getComponentProperty())

            return new Set(properties);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            const mark = args.lazyStatements.length;

            const temp = args.statements;
            args.statements = args.lazyStatements;

            for (const prop of this.getProperties()) {

                const userProp = (prop as PrefabUserPropertyWrapper).getUserProperty();

                userProp.getType().buildSetObjectPropertyCodeDOM(this, args, userProp);
            }

            args.statements = temp;

            if (args.lazyStatements.length > mark) {

                args.lazyStatements.splice(mark, 0,
                    new core.code.RawCodeDOM(""),
                    new core.code.RawCodeDOM(`// ${args.objectVarName} (prefab fields)`));
            }
        }
    }
}