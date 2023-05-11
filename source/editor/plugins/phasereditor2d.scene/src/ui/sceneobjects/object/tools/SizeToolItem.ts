namespace phasereditor2d.scene.ui.sceneobjects {

    export class SizeToolItem
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

                (sprite: sceneobjects.Image) => this._x - sprite.getEditorSupport().computeOrigin().originX,

                (sprite: sceneobjects.Image) => this._y - sprite.getEditorSupport().computeOrigin().originY
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

            for (const obj of args.objects) {

                const sprite = obj as unknown as TileSprite;

                const worldTx = new Phaser.GameObjects.Components.TransformMatrix();

                const initLocalPos = new Phaser.Math.Vector2();

                sprite.getWorldTransformMatrix(worldTx);

                worldTx.applyInverse(point.x, point.y, initLocalPos);

                sprite.setData("SizeTool", {
                    initWidth: sprite.width,
                    initHeight: sprite.height,
                    initLocalPos: initLocalPos,
                    initWorldTx: worldTx
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

            for (const obj of args.objects) {

                const sprite = obj as Sprite;
                const data = sprite.data.get("SizeTool");
                const initLocalPos: Phaser.Math.Vector2 = data.initLocalPos;
                const worldTx: Phaser.GameObjects.Components.TransformMatrix = data.initWorldTx;

                const localPos = new Phaser.Math.Vector2();

                worldTx.applyInverse(args.x, args.y, localPos);

                const flipX = sprite.flipX ? -1 : 1;
                const flipY = sprite.flipY ? -1 : 1;

                const { originX, originY } = sprite.getEditorSupport()
                    .computeOrigin();

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

                const [widthProp, heightProp] = sprite.getEditorSupport().getSizeProperties();

                if (changeX) {

                    widthProp.setValue(sprite, Math.floor(width));
                }

                if (changeY) {

                    heightProp.setValue(sprite, Math.floor(height));
                }

                args.editor.updateInspectorViewSection(obj.getEditorSupport().getSizeSectionId());
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