namespace phasereditor2d.scene.ui.sceneobjects {

    import io = colibri.core.io;

    export function getSceneDisplayName(file: io.FilePath) {

        const finder = ScenePlugin.getInstance().getSceneFinder();

        const settings = finder.getSceneSettings(file);

        if (settings && settings.displayName && settings.displayName.trim() !== "") {

            return settings.displayName;
        }

        return file.getNameWithoutExtension();
    }

    export function findObjectDisplayFormat(obj: ISceneGameObject): string | undefined {

        const objES = obj.getEditorSupport();

        const finder = ScenePlugin.getInstance().getSceneFinder();

        if (objES.isPrefabInstance()) {

            let hierarchy = finder.getPrefabHierarchy(objES.getPrefabId());

            for (const prefabFile of hierarchy) {

                const { prefabObjDisplayFmt } = finder.getSceneSettings(prefabFile);

                if (prefabObjDisplayFmt !== undefined && prefabObjDisplayFmt.trim().length > 0) {

                    return prefabObjDisplayFmt;
                }
            }
        }

        return undefined;
    }

    function getNestedPrefabDisplayName(prefabId: string) {

        const finder = ScenePlugin.getInstance().getSceneFinder();

        const data = finder.getPrefabData(prefabId);

        if (data) {

            if (data.displayName) {

                return data.displayName;
            }

            if (finder.isNestedPrefab(data.prefabId)) {

                return getNestedPrefabDisplayName(data.prefabId);
            }
        }

        return undefined;
    }

    export function formatObjectDisplayText(obj: ISceneGameObject): string {

        const objES = obj.getEditorSupport();

        if (objES.getDisplayName()) {

            return objES.getDisplayName();
        }

        if (objES.isNestedPrefabInstance()) {

            const displayName = getNestedPrefabDisplayName(objES.getPrefabId());

            if (displayName) {

                return displayName;
            }
        }

        const displayFormat = findObjectDisplayFormat(obj);

        if (displayFormat) {

            let prefix = getTargetActionDisplayNamePrefix(objES, obj);

            return prefix + applyFormat(obj, displayFormat);
        }

        return objES.getLabel();
    }

    function getTargetActionDisplayNamePrefix(objES: GameObjectEditorSupport<ISceneGameObject>, obj: ISceneGameObject) {
        
        let prefix = "";

        const targetActionComp = objES.getUserComponentsComponent()
            .getUserComponentNodes()
            .find(n => n.getComponentName() === "ActionTargetComp");

        if (targetActionComp) {

            const props = targetActionComp.getUserComponent()
                .getUserProperties();

            const targetProp = props.findPropertyByName("target");
            const targetNameProp = props.findPropertyByName("targetName");

            let value = "";

            if (targetProp) {

                const target = targetProp.getComponentProperty().getValue(obj);

                if (target) {

                    value = target;
                }
            }

            if (targetNameProp) {

                const name = targetNameProp.getComponentProperty().getValue(obj);

                if (name) {

                    value += " " + name;
                }
            }

            if (value) {

                prefix = value + " → ";
            }
        }
        return prefix;
    }

    function applyFormat(obj: ISceneGameObject, displayFormat: string) {

        const objES = obj.getEditorSupport();

        const data: any = {
            label: objES.getLabel()
        };

        // from prefabs
        {
            const comp = objES.getComponent(PrefabUserPropertyComponent) as PrefabUserPropertyComponent;

            const props = comp.getProperties();

            for (const prop of props) {

                data[prop.name] = prop.getValue(obj);
            }
        }

        // from user components
        let componentsSuffix = "";
        {
            const components = objES.getUserComponentsComponent();

            const props = components.getProperties();

            for (const prop of props) {

                data[prop.codeName] = prop.getValue(obj);
            }

            for(const node of components.getUserComponentNodes()) {

                const comp = node.getUserComponent();

                const format = comp.getObjectDisplayFormat();

                if (format) {

                    const compData = {};

                    for(const userProp of comp.getUserProperties().getProperties()) {

                        const prop = userProp.getComponentProperty();
                        
                        const value = prop.getValue(obj);

                        compData[prop.codeName] = value;
                    }

                    componentsSuffix += ", " + formatString(format, compData);
                }
            }
        }

        const output = formatString(displayFormat, data) + componentsSuffix;

        return output;
    }

    function formatString(displayFormat: string, data: any) {
        let output = displayFormat.replace(/\${(.*?)}/g, (match, p1) => {

            const variableValue = data[p1.trim()];

            return variableValue !== undefined ? variableValue : match;
        });

        output = output.replace(/\#{(.*?)}/g, (match, p1) => {

            const k = p1.trim();

            const variableValue = data[k];

            return Boolean(variableValue) ? `"${k}"` : "";
        });

        output = output.replace(/ +/g, " ").trim();
        return output;
    }

    export function sortGameObjects(objects: ISceneGameObject[]) {

        const sorted = new Set();

        for (const obj of objects) {

            const objES = obj.getEditorSupport();
            const scene = objES.getScene();
            const parent = objES.getObjectParent();

            if (parent && !sorted.has(parent)) {

                parent.getEditorSupport().sortObjectChildren();

                sorted.add(parent);

            } else if (!sorted.has(scene)) {

                scene.sortGameObjects();

                sorted.add(scene);
            }
        }
    }

    export function sortObjectsAlgorithm(children: ISceneGameObject[], countPrefabChildren: number) {

        const start = countPrefabChildren;
        const len = children.length;

        for (let i = start; i < len - 1; i++) {

            for (let j = i + 1; j < len; j++) {

                const a = children[i];
                const b = children[j];

                if (gameObjectSortingWeight(b) < gameObjectSortingWeight(a)) {

                    children[i] = b;
                    children[j] = a;
                }
            }
        }
    }

    export function gameObjectSortingWeight(obj: ISceneGameObject) {

        if (obj instanceof ScriptNode) {

            return 1;
        }

        return 0;
    }

    export function isNestedPrefabInstance(obj: any) {

        const support = GameObjectEditorSupport.getEditorSupport(obj);

        if (support) {

            return support.isNestedPrefabInstance();
        }

        return false;
    }

    export function isGameObject(obj: any) {

        return GameObjectEditorSupport.hasEditorSupport(obj);
    }

    export function isPlainObject(obj: any) {

        return ScenePlainObjectEditorSupport.hasEditorSupport(obj);
    }
}