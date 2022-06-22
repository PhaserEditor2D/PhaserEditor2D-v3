namespace phasereditor2d.scene.ui.sceneobjects {

    export class PolygonToolItem
        extends editor.tools.SceneToolItem implements editor.tools.ISceneToolItemXY {

        private _dragging: boolean;
        private _draggingIndex: number;

        constructor() {
            super();
        }

        getPoint(args: editor.tools.ISceneToolContextArgs): { x: number; y: number; } {

            return { x: 0, y: 0 };
        }

        render(args: editor.tools.ISceneToolRenderArgs) {

            if (args.objects.length !== 1) {

                return;
            }

            const polygon = args.objects[0] as Polygon;

            const points = this.getPolygonScreenPoints(polygon);

            const ctx = args.canvasContext;

            const cursor = args.editor.getMouseManager().getMousePosition();

            let highlightPoint: Phaser.Math.Vector2;

            for (const point of points) {

                if (this.isCursorOnPoint(cursor.x, cursor.y, point)) {

                    highlightPoint = point;

                    break;
                }
            }

            for (const point of points) {

                ctx.save();

                ctx.translate(point.x, point.y);

                const angle = this.globalAngle(polygon);

                ctx.rotate(Phaser.Math.DegToRad(angle));

                const color = point === highlightPoint ? "#f00" : "#fff";

                this.drawRect(ctx, args.canEdit ? color : editor.tools.SceneTool.COLOR_CANNOT_EDIT);

                ctx.restore();
            }
        }

        private getPolygonScreenPoints(polygon: Polygon) {

            const points: Phaser.Math.Vector2[] = [];

            const worldPoint = new Phaser.Math.Vector2(0, 0);

            for (const point of polygon.getPolygonGeom().points) {

                polygon.getWorldTransformMatrix().transformPoint(
                    point.x - polygon.displayOriginX,
                    point.y - polygon.displayOriginY,
                    worldPoint);

                const screenPoint = polygon.scene.cameras.main.getScreenPoint(worldPoint.x, worldPoint.y);

                points.push(screenPoint);
            }

            return points;
        }

        containsPoint(args: editor.tools.ISceneToolDragEventArgs): boolean {

            const points = this.getPolygonScreenPoints(args.objects[0] as Polygon);

            for (const point of points) {

                if (this.isCursorOnPoint(args.x, args.y, point)) {

                    return true;
                }
            }

            return false;
        }

        private isCursorOnPoint(cursorX: number, cursorY: number, point: { x: number, y: number }) {

            return cursorX >= point.x - 5 && cursorX <= point.x + 5
                && cursorY >= point.y - 5 && cursorY <= point.y + 5;
        }

        onStartDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            const polygon = args.objects[0] as Polygon;

            const cursor = args.editor.getMouseManager().getMousePosition();

            const points = this.getPolygonScreenPoints(polygon);

            for (let i = 0; i < points.length; i++) {

                const point = points[i];

                if (this.isCursorOnPoint(cursor.x, cursor.y, point)) {

                    polygon.setData("PolygonToolItem", {
                        initPoints: polygon.points
                    });

                    this._draggingIndex = i;
                    this._dragging = true;

                    break;
                }
            }
        }

        static getInitialPoints(polygon: Polygon) {

            return polygon.getData("PolygonToolItem").initPoints;
        }


        isValidFor(objects: ISceneGameObject[]): boolean {

            return objects.length === 1
                && objects[0].getEditorSupport().hasComponent(PolygonComponent);
        }

        onDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (!this._dragging) {

                return;
            }

            const polygon = args.objects[0] as Polygon;

            const points = polygon.getPolygonGeom().points;

            const point = points[this._draggingIndex];

            const newPoint = args.editor.getScene().getCamera().getWorldPoint(args.x, args.y);

            polygon.getWorldTransformMatrix().applyInverse(newPoint.x, newPoint.y, newPoint);

            point.x = newPoint.x + polygon.displayOriginX;
            point.y = newPoint.y + polygon.displayOriginY;

            polygon.points = points.map(p => `${p.x} ${p.y}`).join(" ");

            args.editor.updateInspectorViewSection(PolygonSection.SECTION_ID);
        }

        onStopDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (this._dragging) {

                args.editor.getUndoManager().add(new PolygonOperation(args));

                this._dragging = false;
            }
        }
    }
}