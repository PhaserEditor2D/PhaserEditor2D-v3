namespace phasereditor2d.scene.ui.sceneobjects {

    export enum ObjectScope {
        LOCAL = "LOCAL",
        METHOD = "METHOD",
        CLASS = "CLASS",
        PUBLIC = "PUBLIC",
        LOCAL_NESTED_PREFAB = "NESTED_PREFAB_LOCAL",
        METHOD_NESTED_PREFAB = "NESTED_PREFAB_METHOD",
        CLASS_NESTED_PREFAB = "NESTED_PREFAB_CLASS",
        PUBLIC_NESTED_PREFAB = "NESTED_PREFAB_PUBLIC",
    }

    export const OBJECT_SCOPES = [
        ObjectScope.LOCAL,
        ObjectScope.METHOD,
        ObjectScope.CLASS,
        ObjectScope.PUBLIC,
        ObjectScope.LOCAL_NESTED_PREFAB,
        ObjectScope.METHOD_NESTED_PREFAB,
        ObjectScope.CLASS_NESTED_PREFAB,
        ObjectScope.PUBLIC_NESTED_PREFAB
    ];

    export function isNestedPrefabScope(scope: ObjectScope) {

        switch (scope) {

            case ObjectScope.LOCAL_NESTED_PREFAB:
            case ObjectScope.METHOD_NESTED_PREFAB:
            case ObjectScope.CLASS_NESTED_PREFAB:
            case ObjectScope.PUBLIC_NESTED_PREFAB:

                return true;
        }

        return false;
    }

    export function isClassOrPublicScope(scope: ObjectScope) {

        return isClassScope(scope) || isPublicScope(scope);
    }

    export function isPublicScope(scope: ObjectScope) {

        switch (scope) {

            case ObjectScope.PUBLIC:
            case ObjectScope.PUBLIC_NESTED_PREFAB:
                
                return true;
        }

        return false;
    }

    export function isLocalScope(scope: ObjectScope) {

        switch (scope) {

            case ObjectScope.LOCAL:
            case ObjectScope.LOCAL_NESTED_PREFAB:
                
                return true;
        }

        return false;
    }

    export function isMethodScope(scope: ObjectScope) {

        switch (scope) {

            case ObjectScope.METHOD:
            case ObjectScope.METHOD_NESTED_PREFAB:
                
                return true;
        }

        return false;
    }

    export function isClassScope(scope: ObjectScope) {

        switch (scope) {

            case ObjectScope.CLASS:
            case ObjectScope.CLASS_NESTED_PREFAB:
                
                return true;
        }

        return false;
    }
}