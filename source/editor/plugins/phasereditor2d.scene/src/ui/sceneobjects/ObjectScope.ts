namespace phasereditor2d.scene.ui.sceneobjects {

    export enum ObjectScope {

        METHOD = "METHOD",
        CLASS = "CLASS",
        PUBLIC = "PUBLIC",
        METHOD_NESTED_PREFAB = "METHOD_NESTED_PREFAB",
        CLASS_NESTED_PREFAB = "CLASS_NESTED_PREFAB",
        PUBLIC_NESTED_PREFAB = "PUBLIC_NESTED_PREFAB",
    }

    export const OBJECT_SCOPES = [
        ObjectScope.METHOD,
        ObjectScope.CLASS,
        ObjectScope.PUBLIC,
        ObjectScope.METHOD_NESTED_PREFAB,
        ObjectScope.CLASS_NESTED_PREFAB,
        ObjectScope.PUBLIC_NESTED_PREFAB
    ];

    export function isNestedPrefabScope(scope: ObjectScope) {

        switch (scope) {

            case ObjectScope.METHOD_NESTED_PREFAB:
            case ObjectScope.CLASS_NESTED_PREFAB:
            case ObjectScope.PUBLIC_NESTED_PREFAB:

                return true;
        }

        return false;
    }
}