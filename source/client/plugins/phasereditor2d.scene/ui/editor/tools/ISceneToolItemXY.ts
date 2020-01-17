namespace phasereditor2d.scene.ui.editor.tools {

    export interface ISceneToolItemXY {

        getPoint(args: ISceneToolRenderArgs): { x: number, y: number };
    }
}