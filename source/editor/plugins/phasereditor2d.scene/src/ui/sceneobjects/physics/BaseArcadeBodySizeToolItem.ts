namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class BaseArcadeBodySizeToolItem
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

        protected getScreenPointOfObject(args: ui.editor.tools.ISceneToolContextArgs, sprite: Sprite, fx: number, fy: number) {

            const worldPoint = new Phaser.Geom.Point(0, 0);

            const { width, height } = this.computeSize(sprite);

            let { displayOriginX, displayOriginY } = sprite.getEditorSupport().computeDisplayOrigin();

            if (sprite instanceof Container) {

                displayOriginX = 0;
                displayOriginY = 0;
            }

            const body = ArcadeComponent.getBody(sprite);
            const x = body.offset.x - displayOriginX + fx * width;
            const y = body.offset.y - displayOriginY + fy * height;

            const tx = sprite.getWorldTransformMatrix();

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

                const { width, height } = this.computeSize(sprite);

                sprite.setData(this.getDataKey(), {
                    initWidth: width,
                    initHeight: height,
                    initLocalPos: initLocalPos,
                    initWorldTx: worldTx
                });
            }
        }

        protected abstract getDataKey(): string;

        protected getInitialSize(obj: any): { x: number, y: number } {

            const data = obj.getData(this.getDataKey());

            return { x: data.initWidth, y: data.initHeight };
        }

        onDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (!this._dragging) {

                return;
            }

            const camera = args.camera;

            for (const obj of args.objects) {

                const sprite = obj as Sprite;
                const data = sprite.data.get(this.getDataKey());
                const initLocalPos: Phaser.Math.Vector2 = data.initLocalPos;
                const worldTx: Phaser.GameObjects.Components.TransformMatrix = data.initWorldTx;

                const localPos = new Phaser.Math.Vector2();

                worldTx.applyInverse(args.x, args.y, localPos);

                const flipX = sprite.flipX ? -1 : 1;
                const flipY = sprite.flipY ? -1 : 1;

                let originX = 0;
                let originY = 0;

                const dx = (localPos.x - initLocalPos.x) * flipX / camera.zoom;
                const dy = (localPos.y - initLocalPos.y) * flipY / camera.zoom;

                const dw = dx / (1 - (originX === 1 ? 0 : originX));
                const dh = dy / (1 - (originY === 1 ? 0 : originY));

                const { x: width, y: height } = args.editor.getScene().snapPoint(
                    data.initWidth + dw,
                    data.initHeight + dh
                );

                const changeAll = this._x === 1 && this._y === 1;
                const changeX = this._x === 1 && this._y === 0.5 || changeAll;
                const changeY = this._x === 0.5 && this._y === 1 || changeAll;

                this.onDragValues(sprite, changeX, changeY, width, height);

                args.editor.updateInspectorViewSection(ArcadeGeometrySection.ID);
            }
        }

        protected abstract onDragValues(sprite: Sprite, changeX: boolean, changeY: boolean, width: number, height: number);

        onStopDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (this._dragging) {

                args.editor.getUndoManager().add(this.createStopDragOperation(args));

                this._dragging = false;
            }
        }

        protected abstract createStopDragOperation(args: editor.tools.ISceneToolDragEventArgs): colibri.ui.ide.undo.Operation;
    }
}