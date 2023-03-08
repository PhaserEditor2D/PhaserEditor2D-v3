namespace phasereditor2d.scene.ui.sceneobjects {

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
}