namespace phasereditor2d.scene.ui.sceneobjects {

    export class RotateToolItem extends editor.tools.SceneToolItem implements editor.tools.ISceneToolItemXY {

        static COLOR = "#aaf";

        private _initCursorPos: { x: number, y: number };

        constructor() {
            super();
        }

        getPoint(args: editor.tools.ISceneToolContextArgs): { x: number; y: number; } {

            return this.getAvgScreenPointOfObjects(args);
        }

        render(args: editor.tools.ISceneToolRenderArgs) {

            const point = this.getPoint(args);

            const ctx = args.canvasContext;

            ctx.beginPath();
            ctx.arc(point.x, point.y, 100, 0, Math.PI * 2);

            ctx.lineWidth = 4;
            ctx.strokeStyle = "#000";
            ctx.stroke();

            ctx.lineWidth = 2;
            ctx.strokeStyle = args.canEdit ? RotateToolItem.COLOR : editor.tools.SceneTool.COLOR_CANNOT_EDIT;
            ctx.stroke();
        }

        containsPoint(args: editor.tools.ISceneToolDragEventArgs): boolean {

            const point = this.getPoint(args);

            const d = Phaser.Math.Distance.Between(args.x, args.y, point.x, point.y);

            return Math.abs(d - 100) < 10;
        }

        onStartDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (!this.containsPoint(args)) {
                return;
            }

            this._initCursorPos = { x: args.x, y: args.y };

            for (const obj of args.objects) {

                obj.setData("AngleToolItem.initAngle", (obj as unknown as ITransformLikeObject).angle);
            }
        }

        onDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (!this._initCursorPos) {
                return;
            }

            const dx = this._initCursorPos.x - args.x;
            const dy = this._initCursorPos.y - args.y;

            if (Math.abs(dx) < 1 || Math.abs(dy) < 1) {
                return;
            }

            const point = this.getPoint(args);

            for (const obj of args.objects) {

                const sprite = obj as unknown as Phaser.GameObjects.Sprite;

                const deltaRadians = angleBetweenTwoPointsWithFixedPoint(
                    args.x, args.y,
                    this._initCursorPos.x, this._initCursorPos.y,
                    point.x, point.y
                );

                const initAngle = sprite.getData("AngleToolItem.initAngle") as number;
                const deltaAngle = Phaser.Math.RadToDeg(deltaRadians);
                sprite.angle = Math.round(initAngle + deltaAngle);
            }

            args.editor.updateInspectorViewSection(TransformSection.SECTION_ID);
        }

        static getInitialAngle(obj: any) {
            return (obj as Phaser.GameObjects.Sprite).getData("AngleToolItem.initAngle") as number;
        }

        onStopDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (!this._initCursorPos) {
                return;
            }

            args.editor.getUndoManager().add(new RotateOperation(args));

            this._initCursorPos = null;
        }
    }

    function angleBetweenTwoPointsWithFixedPoint(
        point1X: number, point1Y: number, point2X: number, point2Y: number,
        fixedX: number, fixedY: number) {

        const angle1 = Math.atan2(point1Y - fixedY, point1X - fixedX);
        const angle2 = Math.atan2(point2Y - fixedY, point2X - fixedX);

        return angle1 - angle2;
    }
}