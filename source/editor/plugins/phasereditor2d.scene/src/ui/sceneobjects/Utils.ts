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

    export function formatObjectDisplayText(obj: ISceneGameObject): string {

        const displayFormat = findObjectDisplayFormat(obj);

        if (displayFormat) {

            return applyFormat(obj, displayFormat);
        }

        const objES = obj.getEditorSupport();

        return objES.getLabel();
    }

    function applyFormat(obj: ISceneGameObject, displayFormat: string) {

        const objES = obj.getEditorSupport();

        const data: any = {
            label: objES.getLabel()
        };

        // from user components
        {
            const comp = objES.getUserComponentsComponent();

            const props = comp.getProperties();

            for (const prop of props) {

                data[prop.codeName] = prop.getValue(obj);
            }
        }

        // from prefabs
        {
            const comp = objES.getComponent(PrefabUserPropertyComponent) as PrefabUserPropertyComponent;

            const props = comp.getProperties();

            for (const prop of props) {

                data[prop.name] = prop.getValue(obj);
            }
        }

        let output = displayFormat.replace(/\${(.*?)}/g, (match, p1) => {

            const variableValue = data[p1.trim()];

            return variableValue !== undefined ? variableValue : match;
        });

        output = output.replace(/\#{(.*?)}/g, (match, p1) => {

            const k = p1.trim();

            const variableValue = data[k];

            return Boolean(variableValue) ? "#" + k : "";
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