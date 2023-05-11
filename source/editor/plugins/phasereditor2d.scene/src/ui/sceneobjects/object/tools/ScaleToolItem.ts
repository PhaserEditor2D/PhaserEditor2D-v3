namespace phasereditor2d.scene.ui.sceneobjects {

    export class ScaleToolItem
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

                (sprite: sceneobjects.Image) => {

                    const originX = sprite.getEditorSupport().computeOrigin().originX;

                    return this._x - originX;
                },

                (sprite: sceneobjects.Image) => {

                    const originY = sprite.getEditorSupport().computeOrigin().originY;

                    return this._y - originY;
                }
            );
        }

        render(args: editor.tools.ISceneToolRenderArgs) {

            const point = this.getPoint(args);

            const ctx = args.canvasContext;

            ctx.save();

            ctx.translate(point.x, point.y);

            const angle = this.globalAngle(args.objects[0] as any);

            ctx.rotate(Phaser.Math.DegToRad(angle));

            this.drawRect(ctx, args.canEdit ? "#0ff" : editor.tools.SceneTool.COLOR_CANNOT_EDIT);

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

                const sprite = obj as unknown as sceneobjects.Sprite;

                const worldTx = new Phaser.GameObjects.Components.TransformMatrix();

                const initLocalPos = new Phaser.Math.Vector2();

                sprite.getWorldTransformMatrix(worldTx);

                worldTx.applyInverse(point.x, point.y, initLocalPos);

                const { width, height } = sprite.getEditorSupport().computeSize();

                sprite.setData("ScaleToolItem", {
                    initScaleX: sprite.scaleX,
                    initScaleY: sprite.scaleY,
                    initWidth: width,
                    initHeight: height,
                    initLocalPos: initLocalPos,
                    initWorldTx: worldTx
                });
            }
        }

        static getInitialScale(obj: any): { x: number, y: number } {

            const data = obj.getData("ScaleToolItem");

            return { x: data.initScaleX, y: data.initScaleY };
        }

        onDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (!this._dragging) {
                return;
            }

            for (const obj of args.objects) {

                const sprite = obj as unknown as sceneobjects.Sprite;

                const data = sprite.data.get("ScaleToolItem");

                const initLocalPos: Phaser.Math.Vector2 = data.initLocalPos;

                const localPos = new Phaser.Math.Vector2();

                const worldTx = data.initWorldTx;

                worldTx.applyInverse(args.x, args.y, localPos);

                let flipX = sprite.flipX ? -1 : 1;
                let flipY = sprite.flipY ? -1 : 1;

                if (sprite instanceof Phaser.GameObjects.TileSprite) {

                    flipX = 1;
                    flipY = 1;
                }

                const dx = (localPos.x - initLocalPos.x) * flipX / args.camera.zoom;
                const dy = (localPos.y - initLocalPos.y) * flipY / args.camera.zoom;

                const { displayOriginX, displayOriginY } = sprite.getEditorSupport()
                    .computeDisplayOrigin();

                let width = data.initWidth - displayOriginX;
                let height = data.initHeight - displayOriginY;

                if (width === 0) {

                    width = data.initWidth;
                }

                if (height === 0) {

                    height = data.initHeight;
                }

                const scaleDX = dx / width * data.initScaleX;
                const scaleDY = dy / height * data.initScaleY;

                const newScaleX = data.initScaleX + scaleDX;
                const newScaleY = data.initScaleY + scaleDY;

                const changeAll = this._x === 1 && this._y === 1;
                const changeX = this._x === 1 && this._y === 0.5 || changeAll;
                const changeY = this._x === 0.5 && this._y === 1 || changeAll;

                if (args.event.shiftKey) {

                    if (changeX && changeY) {

                        const scale = Math.max(newScaleX, newScaleY);
                        sprite.setScale(scale);

                    } else {

                        sprite.setScale(changeX ? newScaleX : newScaleY);
                    }

                } else {

                    if (changeX) {

                        sprite.scaleX = newScaleX;
                    }

                    if (changeY) {

                        sprite.scaleY = newScaleY;
                    }
                }

                args.editor.updateInspectorViewSection(TransformSection.SECTION_ID);
            }
        }

        onStopDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (this._dragging) {

                args.editor.getUndoManager().add(new ScaleOperation(args));

                this._dragging = false;
            }
        }
    }
}