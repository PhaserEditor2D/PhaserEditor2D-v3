namespace phasereditor2d.scene.ui.sceneobjects {

    export class TranslateToolItem
        extends editor.tools.SceneToolItem implements editor.tools.ISceneToolItemXY {

        private _axis: "x" | "y" | "xy";
        private _initCursorPos: { x: number, y: number };

        constructor(axis: "x" | "y" | "xy") {
            super();

            this._axis = axis;
        }

        containsPoint(args: editor.tools.ISceneToolDragEventArgs): boolean {

            const point = this.getPoint(args);

            const d = Phaser.Math.Distance.Between(args.x, args.y, point.x, point.y);

            return d < 20;
        }

        onStartDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (this.containsPoint(args)) {

                this._initCursorPos = { x: args.x, y: args.y };

                for (const obj of args.objects) {

                    const sprite = obj as unknown as Phaser.GameObjects.Sprite;

                    sprite.setData("TranslateTool.initObjectPos", { x: sprite.x, y: sprite.y });
                }
            }
        }

        onDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (!this._initCursorPos) {
                return;
            }

            const dx = args.x - this._initCursorPos.x;
            const dy = args.y - this._initCursorPos.y;

            for (const obj of args.objects) {

                const sprite = obj as unknown as Phaser.GameObjects.Sprite;

                const scale = this.getScreenToObjectScale(args, obj);
                const dx2 = dx / scale.x;
                const dy2 = dy / scale.y;

                const { x, y } = sprite.getData("TranslateTool.initObjectPos");

                const xAxis = this._axis === "x" || this._axis === "xy" ? 1 : 0;
                const yAxis = this._axis === "y" || this._axis === "xy" ? 1 : 0;

                const { x: x2, y: y2 } = args.editor.snapPoint(x + dx2 * xAxis, y + dy2 * yAxis);

                sprite.setPosition(x2, y2);
            }

            args.editor.dispatchSelectionChanged();
        }

        static getInitObjectPosition(obj: any): { x: number, y: number } {
            return (obj as Phaser.GameObjects.Sprite).getData("TranslateTool.initObjectPos");
        }

        onStopDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (this._initCursorPos) {

                const editor = args.editor;

                editor.getUndoManager().add(new TranslateOperation(editor, args));
            }

            this._initCursorPos = null;
        }

        getPoint(args: editor.tools.ISceneToolContextArgs) {

            const { x, y } = this.getAvgScreenPointOfObjects(args);

            return {
                x: this._axis === "x" ? x + 100 : x,
                y: this._axis === "y" ? y + 100 : y
            };
        }

        render(args: editor.tools.ISceneToolRenderArgs) {

            const { x, y } = this.getPoint(args);

            const ctx = args.canvasContext;

            ctx.strokeStyle = "#000";

            if (this._axis === "xy") {

                ctx.fillStyle = "#ffff00";
                ctx.fillRect(x - 5, y - 5, 10, 10);
                ctx.strokeRect(x - 5, y - 5, 10, 10);

            } else {

                ctx.fillStyle = this._axis === "x" ? "#f00" : "#0f0";

                ctx.save();

                ctx.translate(x, y);

                ctx.rotate(this._axis === "x" ? 0 : Math.PI / 2);

                this.drawArrowPath(ctx);

                ctx.restore();
            }
        }
    }
}