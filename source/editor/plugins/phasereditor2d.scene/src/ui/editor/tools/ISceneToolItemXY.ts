namespace phasereditor2d.scene.ui.editor.tools {

    export interface ISceneToolItemXY {

        getPoint(args: ISceneToolContextArgs): { x: number, y: number };

        isValidFor(objects: sceneobjects.ISceneGameObject[]): boolean;
    }
}