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

                    const worldPoint = new Phaser.Math.Vector2();
                    sprite.getWorldTransformMatrix().transformPoint(0, 0, worldPoint);

                    sprite.setData("TranslateTool.localInitPosition", { x: sprite.x, y: sprite.y });
                    sprite.setData("TranslateTool.worldInitPosition", worldPoint);
                }
            }
        }

        onDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (!this._initCursorPos) {
                return;
            }

            const dx = args.x - this._initCursorPos.x;
            const dy = args.y - this._initCursorPos.y;

            let worldDx = dx / args.camera.zoom;
            let worldDy = dy / args.camera.zoom;

            const rot = Phaser.Math.DegToRad(this.getAvgGlobalAngle(args));

            for (const obj of args.objects) {

                const sprite = obj as unknown as Phaser.GameObjects.Sprite;

                const xAxis = this._axis === "x" || this._axis === "xy" ? 1 : 0;
                const yAxis = this._axis === "y" || this._axis === "xy" ? 1 : 0;

                const worldPoint1 = sprite.getData("TranslateTool.worldInitPosition") as Phaser.Math.Vector2;
                const worldPoint2 = worldPoint1.clone();

                if (args.localCoords && this._axis !== "xy") {

                    const axisVector = new Phaser.Math.Vector2(xAxis, yAxis);

                    axisVector.rotate(rot);

                    let worldDeltaVector = new Phaser.Math.Vector2(worldDx, worldDy);

                    const projectionLength = worldDeltaVector.dot(axisVector);

                    worldDeltaVector = axisVector.clone().scale(projectionLength);

                    worldDx = worldDeltaVector.x;
                    worldDy = worldDeltaVector.y;

                    worldPoint2.add(worldDeltaVector);

                } else {

                    worldPoint2.x += worldDx * xAxis;
                    worldPoint2.y += worldDy * yAxis;
                }

                args.editor.getScene().snapVector(worldPoint2);

                let spritePos = new Phaser.Math.Vector2();

                if (sprite.parentContainer) {

                    sprite.parentContainer.getWorldTransformMatrix()
                        .applyInverse(worldPoint2.x, worldPoint2.y, spritePos);

                } else {

                    spritePos = worldPoint2;
                }

                sprite.setPosition(spritePos.x, spritePos.y);
            }

            args.editor.dispatchSelectionChanged();
        }

        static getInitObjectPosition(obj: any): { x: number, y: number } {
            return (obj as Phaser.GameObjects.Sprite).getData("TranslateTool.localInitPosition");
        }

        onStopDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (this._initCursorPos) {

                const editor = args.editor;

                editor.getUndoManager().add(new TranslateOperation(args));
            }

            this._initCursorPos = null;
        }

        getPoint(args: editor.tools.ISceneToolContextArgs) {

            const { x, y } = this.getAvgScreenPointOfObjects(args);

            const xAxis = this._axis === "x" || this._axis === "xy" ? 1 : 0;
            const yAxis = this._axis === "y" || this._axis === "xy" ? 1 : 0;

            const axisVector = new Phaser.Math.Vector2(xAxis, yAxis);

            if (args.localCoords) {

                const angle = this.getAvgGlobalAngle(args);

                axisVector.rotate(Phaser.Math.DegToRad(angle));
            }

            axisVector.scale(100);

            if (this._axis === "xy") {
                return { x, y };
            }

            return {
                x: x + axisVector.x,
                y: y + axisVector.y
            };
        }

        render(args: editor.tools.ISceneToolRenderArgs) {

            const { x, y } = this.getPoint(args);

            const ctx = args.canvasContext;

            ctx.strokeStyle = "#000";

            if (this._axis === "xy") {

                ctx.save();

                ctx.translate(x, y);

                this.drawCircle(ctx,
                    args.canEdit ? "#ff0" : editor.tools.SceneTool.COLOR_CANNOT_EDIT);

                ctx.restore();

            } else {

                ctx.save();

                ctx.translate(x, y);

                if (args.localCoords) {

                    const angle = this.getAvgGlobalAngle(args);

                    ctx.rotate(Phaser.Math.DegToRad(angle));
                }

                if (this._axis === "y") {

                    ctx.rotate(Math.PI / 2);
                }

                this.drawArrowPath(ctx,
                    args.canEdit ? (this._axis === "x" ? "#f00" : "#0f0") : editor.tools.SceneTool.COLOR_CANNOT_EDIT);

                ctx.restore();
            }
        }
    }
}