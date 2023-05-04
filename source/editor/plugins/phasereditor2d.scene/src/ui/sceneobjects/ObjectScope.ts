namespace phasereditor2d.scene.ui.sceneobjects {

    export enum ObjectScope {
        LOCAL = "LOCAL",
        METHOD = "METHOD",
        CLASS = "CLASS",
        PUBLIC = "PUBLIC",
        NESTED_PREFAB = "NESTED_PREFAB",
    }

    export const OBJECT_SCOPES = [
        ObjectScope.LOCAL,
        ObjectScope.METHOD,
        ObjectScope.CLASS,
        ObjectScope.PUBLIC,
        ObjectScope.NESTED_PREFAB
    ];

    export function isNestedPrefabScope(scope: ObjectScope) {

        return scope === ObjectScope.NESTED_PREFAB;
    }

    export function isClassOrPublicScope(scope: ObjectScope) {

        return isClassScope(scope) || isPublicScope(scope);
    }

    export function isPublicScope(scope: ObjectScope) {

        switch (scope) {

            case ObjectScope.PUBLIC:
            case ObjectScope.NESTED_PREFAB:
                
                return true;
        }

        return false;
    }

    export function isLocalScope(scope: ObjectScope) {

        return scope === ObjectScope.LOCAL;
    }

    export function isMethodScope(scope: ObjectScope) {

        return scope === ObjectScope.METHOD;
    }

    export function isClassScope(scope: ObjectScope) {

        return scope === ObjectScope.CLASS;
    }
}