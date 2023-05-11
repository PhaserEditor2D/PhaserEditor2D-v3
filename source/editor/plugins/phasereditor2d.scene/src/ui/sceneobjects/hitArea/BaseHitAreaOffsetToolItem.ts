/// <reference path="./BaseHitAreaToolItem.ts"/>
namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class BaseHitAreaOffsetToolItem
        extends BaseHitAreaToolItem implements editor.tools.ISceneToolItemXY {

        protected _x: IAxisFactor;
        protected _y: IAxisFactor;
        private _dragging: boolean;

        constructor(shape: HitAreaShape, x: IAxisFactor, y: IAxisFactor) {
            super(shape);

            this._x = x;
            this._y = y;
        }

        protected abstract getToolOrigin(obj: ISceneGameObject): { originX: number, originY: number };

        getPoint(args: editor.tools.ISceneToolContextArgs): { x: number; y: number; } {

            return this.getAvgScreenPointOfObjects(args,

                (sprite: sceneobjects.Image) => this._x - this.getToolOrigin(sprite).originX,

                (sprite: sceneobjects.Image) => this._y - this.getToolOrigin(sprite).originY,
            );
        }

        protected getScreenPointOfObject(args: ui.editor.tools.ISceneToolContextArgs, sprite: Sprite, fx: number, fy: number) {

            const worldPoint = new Phaser.Geom.Point(0, 0);

            let { displayOriginX, displayOriginY } = sprite.getEditorSupport().computeDisplayOrigin();

            if (sprite instanceof Container) {

                displayOriginX = 0;
                displayOriginY = 0;
            }

            const offset = this.getOffsetProperties(sprite);
            const size = this.getSizeProperties(sprite);

            let x = offset.x.getValue(sprite) as number;
            let y = offset.y.getValue(sprite) as number;
            let width = size.width.getValue(sprite) as number;
            let height = size.height.getValue(sprite) as number;

            x = x - displayOriginX + fx * width;
            y = y - displayOriginY + fy * height;

            const tx = sprite.getWorldTransformMatrix();

            tx.transformPoint(x, y, worldPoint);

            return args.camera.getScreenPoint(worldPoint.x, worldPoint.y);
        }

        protected computeSize(obj: ISceneGameObject) {

            const size = this.getSizeProperties(obj);

            return {
                width: size.width.getValue(obj) as number,
                height: size.height.getValue(obj) as number
            }
        }

        private computeOffset(obj: ISceneGameObject) {

            const offset = this.getOffsetProperties(obj);

            return {
                x: offset.x.getValue(obj),
                y: offset.y.getValue(obj)
            }
        };

        protected abstract getOffsetProperties(obj: ISceneGameObject): {
            x: IProperty<ISceneGameObject>,
            y: IProperty<ISceneGameObject>
        };

        protected abstract getSizeProperties(obj: ISceneGameObject): {
            width: IProperty<ISceneGameObject>,
            height: IProperty<ISceneGameObject>
        };

        render(args: editor.tools.ISceneToolRenderArgs) {

            const point = this.getPoint(args);

            const ctx = args.canvasContext;

            ctx.save();

            ctx.translate(point.x, point.y);

            const angle = this.globalAngle(args.objects[0] as any);
            ctx.rotate(Phaser.Math.DegToRad(angle));

            this.drawRect(ctx, args.canEdit ?
                EditHitAreaTool.TOOL_COLOR : editor.tools.SceneTool.COLOR_CANNOT_EDIT);

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

                const sprite = obj as unknown as Image;

                const worldTx = new Phaser.GameObjects.Components.TransformMatrix();

                const initLocalPos = new Phaser.Math.Vector2();

                sprite.getWorldTransformMatrix(worldTx);

                worldTx.applyInverse(point.x, point.y, initLocalPos);

                const offset = this.computeOffset(sprite);

                sprite.setData(this.getKeyData(), {
                    initLocalPos: initLocalPos,
                    initLocalOffset: offset,
                    initWorldTx: worldTx
                });
            }
        }

        protected getInitialValue(obj: ISceneGameObject) {

            const { initLocalOffset } = obj.getData(this.getKeyData());

            return initLocalOffset;
        }

        protected abstract getKeyData(): string;

        onDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (!this._dragging) {
                return;
            }

            const camera = args.camera;

            for (const obj of args.objects) {

                const sprite = obj as Sprite;
                const data = sprite.data.get(this.getKeyData());
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

                const offset = this.getOffsetProperties(obj);

                if (changeX) {

                    offset.x.setValue(sprite, Math.floor(x));
                }

                if (changeY) {

                    offset.y.setValue(sprite, Math.floor(y));
                }

                args.editor.updateInspectorViewSection(this.getOffsetSectionId());
            }
        }

        protected abstract getOffsetSectionId(): string;

        onStopDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (this._dragging) {

                args.editor.getUndoManager().add(this.createStopDragOperation(args));

                this._dragging = false;
            }
        }

        protected abstract createStopDragOperation(args: editor.tools.ISceneToolDragEventArgs): colibri.ui.ide.undo.Operation;
    }
}