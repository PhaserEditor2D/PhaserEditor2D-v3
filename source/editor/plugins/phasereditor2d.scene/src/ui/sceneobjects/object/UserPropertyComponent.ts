namespace phasereditor2d.scene.ui.sceneobjects {

    import io = colibri.core.io;

    export interface IUserPropertiesInObject {

        prefabFile: colibri.core.io.FilePath;
        properties: UserProperty[];
    }

    export class UserPropertyComponent extends Component<ISceneObject> {

        private _data: any;

        constructor(obj: ISceneObject) {
            super(obj, []);

            this._data = {};
        }

        writeJSON(ser: core.json.Serializer) {

            super.writeJSON(ser);
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

                // TODO: missing get properties of nested prefabs

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

            const userProps = new UserProperties();

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

            for (const prop of this.getProperties()) {

                const userProp = prop.getUserProperty();

                userProp.getType().buildSetObjectPropertyCodeDOM(this, args, userProp);
            }
        }
    }
}