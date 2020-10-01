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

            const editorSupport = this.getObject().getEditorSupport();

            if (editorSupport.isPrefabInstance()) {

                const prefabFile = this.getObject().getEditorSupport().getPrefabFile();

                if (prefabFile) {

                    this.getPrefabProperties(propertiesInObject, prefabFile);
                }
            }

            return propertiesInObject;
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