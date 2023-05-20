namespace phasereditor2d.scene.ui.sceneobjects {

    export class BaseArcadeBodyOffsetToolItem
        extends editor.tools.SceneToolItem implements editor.tools.ISceneToolItemXY {

        private _x: IAxisFactor;
        private _y: IAxisFactor;
        private _dragging: boolean;

        constructor(x: IAxisFactor, y: IAxisFactor) {
            super();

            this._x = x;
            this._y = y;
        }

        getPoint(args: editor.tools.ISceneToolContextArgs): { x: number; y: number; } {

            return this.getAvgScreenPointOfObjects(args,

                (sprite: sceneobjects.Image) => this._x,

                (sprite: sceneobjects.Image) => this._y,

                // remove rotation, not supported by the arcade body
                true
            );
        }

        protected getScreenPointOfObject(args: ui.editor.tools.ISceneToolContextArgs, sprite: Sprite, fx: number, fy: number, removeRotation = false) {

            const worldPoint = new Phaser.Geom.Point(0, 0);

            let width: number;
            let height: number;

            if (ArcadeComponent.isCircleBody(sprite)) {

                width = ArcadeComponent.radius.getValue(sprite) * 2;
                height = width;

            } else {

                const size = this.computeSize(sprite);
                width = size.width;
                height = size.height;
            }

            let { displayOriginX, displayOriginY } = sprite.getEditorSupport().computeDisplayOrigin();

            if (sprite instanceof Container) {
                
                displayOriginX = 0;
                displayOriginY = 0;
            }

            const body = ArcadeComponent.getBody(sprite);

            const x = body.offset.x - displayOriginX + fx * width;
            const y = body.offset.y - displayOriginY + fy * height;

            const tx = sprite.getWorldTransformMatrix();

            if (removeRotation) {

                tx.rotate(-tx.rotation);
            }

            tx.transformPoint(x, y, worldPoint);

            return args.camera.getScreenPoint(worldPoint.x, worldPoint.y);
        }

        protected computeSize(obj: ISceneGameObject) {

            return {
                width: ArcadeComponent.size.x.getValue(obj),
                height: ArcadeComponent.size.y.getValue(obj)
            };
        }

        render(args: editor.tools.ISceneToolRenderArgs) {

            const point = this.getPoint(args);

            const ctx = args.canvasContext;

            ctx.save();

            ctx.translate(point.x, point.y);

            // remove totation, not supported by the Arcade body
            // const angle = this.globalAngle(args.objects[0] as any);
            // ctx.rotate(Phaser.Math.DegToRad(angle));

            this.drawRect(ctx, args.canEdit ?
                ArcadeBodyTool.BODY_TOOL_COLOR : editor.tools.SceneTool.COLOR_CANNOT_EDIT);

            ctx.restore();
        }

        containsPoint(args: editor.tools.ISceneToolDragEventArgs): boolean {

            const point = this.getPoint(args);

            return Phaser.Math.Distance.Between(args.x, args.y, point.x, point.y) < 20;
        }

        onStartDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (!this.containsPoint(args)) {
                return;
            }

            this._dragging = true;

            const point = this.getPoint(args);

            for (const obj of args.objects) {

                const sprite = obj as unknown as ArcadeImage;

                const worldTx = new Phaser.GameObjects.Components.TransformMatrix();

                const initLocalPos = new Phaser.Math.Vector2();

                sprite.getWorldTransformMatrix(worldTx);

                worldTx.applyInverse(point.x, point.y, initLocalPos);

                sprite.setData("ArcadeBodyOffsetToolItem", {
                    initLocalPos: initLocalPos,
                    initLocalOffset: sprite.body.offset.clone(),
                    initWorldTx: worldTx
                });
            }
        }

        static getInitialOffset(obj: any): { x: number, y: number } {

            const data = obj.getData("ArcadeBodyOffsetToolItem");

            return data.initLocalPos;
        }

        onDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (!this._dragging) {
                return;
            }

            const camera = args.camera;

            for (const obj of args.objects) {

                const sprite = obj as Sprite;
                const data = sprite.data.get("ArcadeBodyOffsetToolItem");
                const initLocalPos: Phaser.Math.Vector2 = data.initLocalPos;
                const worldTx: Phaser.GameObjects.Components.TransformMatrix = data.initWorldTx;

                const localPos = new Phaser.Math.Vector2();

                worldTx.applyInverse(args.x, args.y, localPos);

                const flipX = sprite.flipX ? -1 : 1;
                const flipY = sprite.flipY ? -1 : 1;

                const dx = (localPos.x - initLocalPos.x) * flipX / camera.zoom;
                const dy = (localPos.y - initLocalPos.y) * flipY / camera.zoom;

                const x = data.initLocalOffset.x + dx;
                const y = data.initLocalOffset.y + dy;

                const changeAll = this._x === 0 && this._y === 0 || this._x === 0.5 && this._y === 0.5;
                const changeX = this._x === 0 && this._y === 0.5 || changeAll;
                const changeY = this._x === 0.5 && this._y === 0 || changeAll;

                const xProp = ArcadeComponent.offset.x;
                const yProp = ArcadeComponent.offset.y;

                if (changeX) {

                    xProp.setValue(sprite, Math.floor(x));
                }

                if (changeY) {

                    yProp.setValue(sprite, Math.floor(y));
                }

                args.editor.updateInspectorViewSection(ArcadeGeometrySection.ID);
            }
        }

        onStopDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (this._dragging) {

                args.editor.getUndoManager().add(new BodyOffsetOperation(args));

                this._dragging = false;
            }
        }
    }
}