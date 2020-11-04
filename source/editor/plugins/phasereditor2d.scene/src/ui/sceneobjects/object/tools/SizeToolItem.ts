namespace phasereditor2d.scene.ui.sceneobjects {

    export class SizeToolItem
        extends editor.tools.SceneToolItem implements editor.tools.ISceneToolItemXY {

        private _x: IScaleAxis;
        private _y: IScaleAxis;
        private _dragging: boolean;

        constructor(x: IScaleAxis, y: IScaleAxis) {
            super();

            this._x = x;
            this._y = y;
        }

        getPoint(args: editor.tools.ISceneToolContextArgs): { x: number; y: number; } {

            return this.getAvgScreenPointOfObjects(args,

                (sprite: Phaser.GameObjects.Sprite) => this._x - sprite.originX,

                (sprite: Phaser.GameObjects.Sprite) => this._y - sprite.originY
            );
        }

        render(args: editor.tools.ISceneToolRenderArgs) {

            const point = this.getPoint(args);

            const ctx = args.canvasContext;

            ctx.save();

            ctx.translate(point.x, point.y);

            const angle = this.globalAngle(args.objects[0] as any);

            ctx.rotate(Phaser.Math.DegToRad(angle));

            this.drawRect(ctx, args.canEdit ? "#00f" : editor.tools.SceneTool.COLOR_CANNOT_EDIT);

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

            const worldTx = new Phaser.GameObjects.Components.TransformMatrix();

            for (const obj of args.objects) {

                const sprite = obj as unknown as TileSprite;

                const initLocalPos = new Phaser.Math.Vector2();
                sprite.getWorldTransformMatrix(worldTx);
                worldTx.applyInverse(point.x, point.y, initLocalPos);

                sprite.setData("SizeTool", {
                    initWidth: sprite.width,
                    initHeight: sprite.height,
                    initLocalPos: initLocalPos
                });
            }
        }

        static getInitialSize(obj: any): { x: number, y: number } {

            const data = obj.getData("SizeTool");

            return { x: data.initWidth, y: data.initHeight };
        }

        onDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (!this._dragging) {
                return;
            }

            const camera = args.camera;

            const worldTx = new Phaser.GameObjects.Components.TransformMatrix();

            for (const obj of args.objects) {

                const sprite = obj as Sprite;
                const data = sprite.data.get("SizeTool");
                const initLocalPos: Phaser.Math.Vector2 = data.initLocalPos;

                const localPos = new Phaser.Math.Vector2();
                sprite.getWorldTransformMatrix(worldTx);
                worldTx.applyInverse(args.x, args.y, localPos);

                const flipX = sprite.flipX ? -1 : 1;
                const flipY = sprite.flipY ? -1 : 1;

                const dx = (localPos.x - initLocalPos.x) * flipX / camera.zoom;
                const dy = (localPos.y - initLocalPos.y) * flipY / camera.zoom;

                const { x: width, y: height } = args.editor.getScene().snapPoint(
                    data.initWidth + dx,
                    data.initHeight + dy);

                const changeAll = this._x === 1 && this._y === 1;
                const changeX = this._x === 1 && this._y === 0.5 || changeAll;
                const changeY = this._x === 0.5 && this._y === 1 || changeAll;

                if (changeX) {

                    sprite.setSize(Math.floor(width), sprite.height);
                    sprite.updateDisplayOrigin();
                }

                if (changeY) {

                    sprite.setSize(sprite.width, Math.floor(height));
                    sprite.updateDisplayOrigin();
                }

                args.editor.updateInspectorViewSection(SizeSection.SECTION_ID);
            }
        }

        onStopDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (this._dragging) {

                args.editor.getUndoManager().add(new SizeOperation(args));

                this._dragging = false;
            }
        }
    }
}