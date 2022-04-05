namespace phasereditor2d.scene.ui.sceneobjects {

    interface IResultItem {
        obj: ISceneGameObject,
        points: Array<{
            point: Phaser.Math.Vector2,
            contains: boolean;
        }>
    }

    export class SelectionRegionTool extends editor.tools.SceneTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.SelectionRegionTool";
        private _cursorStartPoint: Phaser.Math.Vector2;
        private _cursorCurrentPoint: Phaser.Math.Vector2;

        constructor() {
            super({
                command: editor.commands.CMD_SELECT_REGION,
                id: SelectionRegionTool.ID
            });
        }

        onStartDrag(args: editor.tools.ISceneToolDragEventArgs) {

            this._cursorStartPoint = new Phaser.Math.Vector2(args.x, args.y);

            if (!args.event.ctrlKey) {

                args.editor.setSelection([]);
            }
        }

        onDrag(args: editor.tools.ISceneToolDragEventArgs) {

            if (this._cursorStartPoint) {

                this._cursorCurrentPoint = new Phaser.Math.Vector2(args.x, args.y);

                args.editor.getOverlayLayer().render();
            }
        }

        onStopDrag(args: editor.tools.ISceneToolDragEventArgs) {

            if (this._cursorStartPoint && this._cursorCurrentPoint) {

                const result = this.getRegionResult(args.editor);

                const newSel = result

                    .filter(item => item.points.length === item.points.filter(p => p.contains).length)

                    .map(item => item.obj);


                this._cursorStartPoint = null;
                this._cursorCurrentPoint = null;

                if (args.event.ctrlKey) {

                    const sel = [...args.editor.getSelection()];

                    for (const obj of newSel) {

                        if (sel.indexOf(obj) < 0) {

                            sel.push(obj);
                        }
                    }

                    args.editor.setSelection(sel);

                } else {

                    args.editor.setSelection(newSel);
                }
            } else {

                args.editor.repaint();
            }
        }

        canEdit(obj: unknown): boolean {

            return false;
        }

        canRender(obj: unknown): boolean {

            return false;
        }

        isObjectTool() {

            return false;
        }

        getRegionResult(editor: editor.SceneEditor): IResultItem[] {

            const scene = editor.getScene();

            const start = this._cursorStartPoint;
            const end = this._cursorCurrentPoint;

            const result: IResultItem[] = [];

            // TODO: don't enter in prefab objects
            scene.visitAllAskChildren(obj => {

                if (GameObjectEditorSupport.hasObjectComponent(obj, TransformComponent)) {

                    const points = obj.getEditorSupport().getScreenBounds(scene.getCamera());

                    const x1 = Math.min(start.x, end.x);
                    const x2 = Math.max(start.x, end.x);
                    const y1 = Math.min(start.y, end.y);
                    const y2 = Math.max(start.y, end.y);

                    const pointsData = points.map(point => {

                        if (point.x >= x1 && point.x <= x2 && point.y >= y1 && point.y <= y2) {

                            return {
                                point,
                                contains: true
                            };
                        } else {

                            return {
                                point,
                                contains: false
                            }
                        }
                    });

                    result.push({
                        obj,
                        points: pointsData
                    });
                }

                if (obj.getEditorSupport().isPrefabInstance()) {

                    return false;
                }

                if (obj instanceof Container) {

                    if (!obj.getEditorSupport().isAllowPickChildren()) {

                        return false;
                    }
                }

                return true;
            });

            return result;
        }

        render(args: editor.tools.ISceneToolRenderArgs) {

            if (!this._cursorStartPoint || !this._cursorCurrentPoint) {

                return;
            }

            const ctx = args.canvasContext;

            ctx.save();

            ctx.strokeStyle = "black";
            ctx.lineWidth = 4;

            ctx.strokeRect(
                this._cursorStartPoint.x,
                this._cursorStartPoint.y,
                this._cursorCurrentPoint.x - this._cursorStartPoint.x,
                this._cursorCurrentPoint.y - this._cursorStartPoint.y);

            ctx.strokeStyle = "#00ff00";
            ctx.lineWidth = 2;

            ctx.strokeRect(
                this._cursorStartPoint.x,
                this._cursorStartPoint.y,
                this._cursorCurrentPoint.x - this._cursorStartPoint.x,
                this._cursorCurrentPoint.y - this._cursorStartPoint.y);

            ctx.restore();

            ctx.save();

            const result = this.getRegionResult(args.editor);

            for (const resultItem of result) {

                if (resultItem.points.filter(p => p.contains).length > 0) {

                    for (const pointData of resultItem.points) {

                        ctx.beginPath();
                        ctx.arc(pointData.point.x, pointData.point.y, 2, 0, Math.PI * 2);

                        ctx.fillStyle = pointData.contains ? "#0f0" : "#fff";
                        ctx.fill();

                        ctx.strokeStyle = "#000";
                        ctx.stroke();
                    }
                }
            }

            ctx.restore();
        }
    }
}