namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ISceneGameObject extends

        ISceneGameObjectLike,

        Phaser.GameObjects.GameObject {

        getEditorSupport(): GameObjectEditorSupport<ISceneGameObject>;
    }

    export function isGameObject(obj: any) {

        return GameObjectEditorSupport.hasEditorSupport(obj);
    }
}