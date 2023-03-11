namespace phasereditor2d.scene.ui.sceneobjects {

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

        for (let i = start; i < len - 1 ; i++) {

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

    export function isDisplayObject(obj: any) {

        return isGameObject(obj) && !(obj instanceof ScriptNode));
    }
}