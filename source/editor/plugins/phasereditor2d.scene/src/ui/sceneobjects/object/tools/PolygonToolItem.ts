namespace phasereditor2d.scene.ui.sceneobjects {

    export class PolygonToolItem
        extends editor.tools.SceneToolItem implements editor.tools.ISceneToolItemXY {
        private _dragging: boolean;
        private _draggingIndex: number;
        private _newPoint: Phaser.Math.Vector2;
        private _newPointIndex: number;
        private _highlightPointIndex = -1;

        constructor() {
            super();
        }

        handleDoubleClick(args: editor.tools.ISceneToolContextArgs): boolean {

            if (this._highlightPointIndex >= 0) {

                const op = new editor.undo.SceneSnapshotOperation(args.editor, async () => {

                    this.handleDeleteCommand(args);
                });

                args.editor.getUndoManager().add(op);

                return true;
            }

            return false;
        }

        handleDeleteCommand(args: editor.tools.ISceneToolContextArgs): boolean {

            if (this._highlightPointIndex >= 0) {

                const polygon = args.objects[0] as Polygon;

                const points = polygon.getPolygonGeom().points;

                if (points.length <= 3) {

                    return true;
                }

                const newPoints = [];

                for (let i = 0; i < points.length; i++) {

                    if (i !== this._highlightPointIndex) {

                        newPoints.push(points[i]);
                    }
                }

                polygon.points = newPoints.map(p => `${p.x} ${p.y}`).join(" ");

                return true;
            }

            return false;
        }

        getPoint(args: editor.tools.ISceneToolContextArgs): { x: number; y: number; } {

            return { x: 0, y: 0 };
        }

        render(args: editor.tools.ISceneToolRenderArgs) {

            if (args.objects.length !== 1) {

                return;
            }

            let nearPoint: Phaser.Geom.Point;
            let nearPointIndex: number;

            const polygon = args.objects[0] as Polygon;

            const points = this.getPolygonScreenPoints(polygon);

            const ctx = args.canvasContext;

            const cursor = args.editor.getMouseManager().getMousePosition();

            // find highlihting point

            let highlightPoint: Phaser.Math.Vector2;
            let highlightPointIndex = -1;

            for (let i = 0; i < points.length; i++) {

                const point = points[i];

                if (this.isCursorOnPoint(cursor.x, cursor.y, point)) {

                    highlightPoint = point;
                    highlightPointIndex = i;

                    break;
                }
            }


            if (!highlightPoint) {

                // paint near line

                let nearLine: Phaser.Geom.Line;
                let nearLineDistance = Number.MAX_VALUE;

                const line = new Phaser.Geom.Line();
                const tempPoint = new Phaser.Geom.Point();

                for (let i = 0; i < points.length; i++) {

                    const p1 = points[i];
                    const p2 = points[(i + 1) % points.length];

                    line.setTo(p1.x, p1.y, p2.x, p2.y);

                    Phaser.Geom.Line.GetNearestPoint(line, new Phaser.Geom.Point(cursor.x, cursor.y), tempPoint);

                    const d = Phaser.Math.Distance.BetweenPoints(cursor, tempPoint);

                    if (d < 10 && d < nearLineDistance) {

                        const lineLength = Phaser.Geom.Line.Length(line);
                        const length1 = Phaser.Math.Distance.BetweenPoints(p1, tempPoint);
                        const length2 = Phaser.Math.Distance.BetweenPoints(p2, tempPoint);

                        // check the point is inside the segment
                        if (length1 <= lineLength && length2 <= lineLength) {

                            nearLineDistance = d;
                            nearPointIndex = i;

                            if (nearLine) {

                                nearLine.setTo(line.x1, line.y1, line.x2, line.y2);
                                nearPoint.setTo(tempPoint.x, tempPoint.y);

                            } else {

                                nearLine = new Phaser.Geom.Line(line.x1, line.y1, line.x2, line.y2);
                                nearPoint = new Phaser.Geom.Point(tempPoint.x, tempPoint.y);
                            }
                        }
                    }
                }

                if (nearLine) {

                    const color = args.canEdit ? "#fff" : editor.tools.SceneTool.COLOR_CANNOT_EDIT;

                    // draw near line

                    ctx.save();

                    ctx.translate(nearLine.x1, nearLine.y1);

                    const angle = this.globalAngle(polygon);

                    ctx.rotate(Phaser.Math.DegToRad(angle));

                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(nearLine.x2 - nearLine.x1, nearLine.y2 - nearLine.y1);
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 3;
                    ctx.stroke();

                    ctx.restore();

                    // draw near point

                    ctx.save();

                    ctx.translate(nearPoint.x, nearPoint.y);
                    ctx.rotate(Phaser.Math.DegToRad(this.globalAngle(polygon)));

                    this.drawRect(ctx, args.canEdit ? "#faa" : editor.tools.SceneTool.COLOR_CANNOT_EDIT);

                    ctx.restore();
                }
            }

            // paint highlight point

            for (const point of points) {

                ctx.save();

                ctx.translate(point.x, point.y);

                const angle = this.globalAngle(polygon);

                ctx.rotate(Phaser.Math.DegToRad(angle));

                const color = point === highlightPoint ? "#f00" : "#fff";

                this.drawRect(ctx, args.canEdit ? color : editor.tools.SceneTool.COLOR_CANNOT_EDIT);

                ctx.restore();
            }

            this._newPoint = nearPoint ? this.getPolygonLocalPoint(polygon, nearPoint) : undefined;
            this._newPointIndex = nearPointIndex;
            this._highlightPointIndex = highlightPointIndex;
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

        getPolygonLocalPoint(polygon: Polygon, point: { x: number, y: number }) {

            const camera = polygon.scene.cameras.main;
            point = camera.getWorldPoint2(point.x, point.y);

            const localPoint = polygon.getWorldTransformMatrix().applyInverse(point.x, point.y);
            localPoint.x += polygon.displayOriginX;
            localPoint.y += polygon.displayOriginY;

            return localPoint;
        }

        containsPoint(args: editor.tools.ISceneToolDragEventArgs): boolean {

            if (this._newPoint) {

                return true;
            }

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

        private _startDragTime = 0;

        onStartDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            this._startDragTime = Date.now();

            const polygon = args.objects[0] as Polygon;

            if (this._newPoint) {

                const points = polygon.getPolygonGeom().points;

                let newPoints: { x: number, y: number }[] = [];

                for (let i = 0; i < points.length; i++) {

                    const point = points[i];

                    newPoints.push(point);

                    if (this._newPointIndex === i) {

                        newPoints.push(this._newPoint);
                    }
                }

                polygon.points = newPoints.map(p => `${p.x} ${p.y}`).join(" ");
            }

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

            this._newPoint = undefined;

            if (this._dragging) {

                if (Date.now() - this._startDragTime > 300) {

                    args.editor.getUndoManager().add(new PolygonOperation(args));

                }

                this._dragging = false;
            }
        }

    }
}