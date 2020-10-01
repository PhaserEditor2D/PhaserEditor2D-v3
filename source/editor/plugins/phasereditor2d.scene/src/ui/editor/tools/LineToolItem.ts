/// <reference path="./SceneToolItem.ts" />

namespace phasereditor2d.scene.ui.editor.tools {

    export class LineToolItem extends SceneToolItem {

        private _tools: ISceneToolItemXY[];
        private _color: string;

        constructor(color: string, ...tools: ISceneToolItemXY[]) {
            super();

            this._color = color;
            this._tools = tools;
        }

        isValidFor(objects: sceneobjects.ISceneGameObject[]) {

            for (const tool of this._tools) {

                if (!tool.isValidFor(objects)) {
                    return false;
                }
            }

            return true;
        }

        render(args: ISceneToolRenderArgs) {

            const ctx = args.canvasContext;

            ctx.save();

            ctx.beginPath();

            let start = true;

            for (const tool of this._tools) {

                const { x, y } = tool.getPoint(args);

                if (start) {

                    ctx.moveTo(x, y);

                } else {

                    ctx.lineTo(x, y);
                }

                start = false;
            }

            ctx.strokeStyle = "#000";
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.strokeStyle = args.canEdit ? this._color : SceneTool.COLOR_CANNOT_EDIT;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.restore();
        }

        containsPoint(args: ISceneToolDragEventArgs): boolean {
            return false;
        }

        onStartDrag(args: ISceneToolDragEventArgs): void {
            // nothing
        }

        onDrag(args: ISceneToolDragEventArgs): void {
            // nothing
        }

        onStopDrag(args: ISceneToolDragEventArgs): void {
            // nothing
        }
    }
}