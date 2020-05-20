namespace phasereditor2d.scene.ui.sceneobjects {

    export interface IOriginToolSpriteData {
        x: number;
        y: number;
        originX: number;
        originY: number;
    }

    export class OriginToolItem
        extends editor.tools.SceneToolItem implements editor.tools.ISceneToolItemXY {

        private _axis: "x" | "y" | "xy";
        private _initCursorPos: { x: number, y: number };
        private _displayOrigin_1: Phaser.Math.Vector2;
        private _worldPosition_1: Phaser.Math.Vector2;
        private _worldTx_1: Phaser.GameObjects.Components.TransformMatrix;
        private _position_1: Phaser.Math.Vector2;
        private _localTx_1: Phaser.GameObjects.Components.TransformMatrix;
        private _origin_1: Phaser.Math.Vector2;

        constructor(axis: "x" | "y" | "xy") {
            super();

            this._axis = axis;
        }

        isValidFor(objects: sceneobjects.ISceneObject[]) {

            return objects.length === 1 && objects[0].getEditorSupport().hasComponent(OriginComponent);
        }

        containsPoint(args: editor.tools.ISceneToolDragEventArgs): boolean {

            const point = this.getPoint(args);

            const d = Phaser.Math.Distance.Between(args.x, args.y, point.x, point.y);

            return d < 20;
        }

        onStartDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (this.containsPoint(args)) {

                this._initCursorPos = { x: args.x, y: args.y };

                const sprite = this.getSprite(args);

                const worldPoint = new Phaser.Math.Vector2();
                const tx = sprite.getWorldTransformMatrix();
                tx.transformPoint(0, 0, worldPoint);

                this._worldPosition_1 = worldPoint;
                this._worldTx_1 = tx;
                this._localTx_1 = sprite.getLocalTransformMatrix();
                this._displayOrigin_1 = new Phaser.Math.Vector2(sprite.displayOriginX, sprite.displayOriginY);
                this._origin_1 = new Phaser.Math.Vector2(sprite.originX, sprite.originY);
                this._position_1 = new Phaser.Math.Vector2(sprite.x, sprite.y);
            }
        }

        private getSprite(args: editor.tools.ISceneToolDragEventArgs) {

            return args.objects[0] as unknown as Phaser.GameObjects.Sprite;
        }

        onDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (!this._initCursorPos) {
                return;
            }

            const cursorDx = args.x - this._initCursorPos.x;
            const cursorDy = args.y - this._initCursorPos.y;

            const xAxis = this._axis === "x" || this._axis === "xy" ? 1 : 0;
            const yAxis = this._axis === "y" || this._axis === "xy" ? 1 : 0;

            const worldDx = cursorDx / args.camera.zoom * xAxis;
            const worldDy = cursorDy / args.camera.zoom * yAxis;

            const sprite = this.getSprite(args);

            const worldPoint2 = this._worldPosition_1.clone();
            worldPoint2.x += worldDx;
            worldPoint2.y += worldDy;

            const displayOriginPoint_2 = new Phaser.Math.Vector2();
            this._worldTx_1.applyInverse(worldPoint2.x, worldPoint2.y, displayOriginPoint_2);

            // when get the display point, it uses the initial origin,
            // so we have to add it to the result, to get a 0,0 based display origin.
            const originX_2 = (this._displayOrigin_1.x + displayOriginPoint_2.x) / sprite.width;
            const originY_2 = (this._displayOrigin_1.y + displayOriginPoint_2.y) / sprite.height;

            OriginToolItem.changeOriginKeepPosition(
                sprite,
                this._displayOrigin_1.x,
                this._displayOrigin_1.y,
                originX_2,
                originY_2,
                this._localTx_1,
                this._position_1.x,
                this._position_1.y
            );

            // sprite.setOrigin(originX_2, originY_2);

            // const displayOriginDx = sprite.displayOriginX - this._displayOrigin_1.x;
            // const displayOriginDy = sprite.displayOriginY - this._displayOrigin_1.y;

            // const displayOriginDelta = new Phaser.Math.Vector2(
            //     displayOriginDx,
            //     displayOriginDy
            // );

            // this._localTx_1.transformPoint(displayOriginDelta.x, displayOriginDelta.y, displayOriginDelta);

            // displayOriginDelta.add(this._position_1.clone().negate());

            // sprite.setPosition(
            //     this._position_1.x + displayOriginDelta.x,
            //     this._position_1.y + displayOriginDelta.y);

            args.editor.dispatchSelectionChanged();
        }

        static simpleChangeOriginKeepPosition(
            sprite: Phaser.GameObjects.Sprite,
            newOriginX: number,
            newOriginY: number
        ) {
            this.changeOriginKeepPosition(
                sprite,
                sprite.displayOriginX,
                sprite.displayOriginY,
                newOriginX,
                newOriginY,
                sprite.getLocalTransformMatrix(),
                sprite.x,
                sprite.y
            );
        }

        static changeOriginKeepPosition(
            sprite: Phaser.GameObjects.Sprite,
            displayOriginX_1: number,
            displayOriginY_1: number,
            originX_2: number,
            originY_2: number,
            localTx_1: Phaser.GameObjects.Components.TransformMatrix,
            x_1: number,
            y_1: number
        ) {

            sprite.setOrigin(originX_2, originY_2);

            const displayOriginDx = sprite.displayOriginX - displayOriginX_1;
            const displayOriginDy = sprite.displayOriginY - displayOriginY_1;

            const displayOriginDelta = new Phaser.Math.Vector2(
                displayOriginDx,
                displayOriginDy
            );

            localTx_1.transformPoint(displayOriginDelta.x, displayOriginDelta.y, displayOriginDelta);

            displayOriginDelta.add(new Phaser.Math.Vector2(-x_1, -y_1));

            sprite.setPosition(
                x_1 + displayOriginDelta.x,
                y_1 + displayOriginDelta.y);
        }

        static getInitObjectOriginAndPosition(obj: Phaser.GameObjects.Sprite) {

            return obj.getData("OriginTool.initData") as IOriginToolSpriteData;
        }

        static createFinalData(sprite: Phaser.GameObjects.Sprite) {

            return {
                x: sprite.x,
                y: sprite.y,
                originX: sprite.originX,
                originY: sprite.originY
            };
        }

        onStopDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (this._initCursorPos) {

                const editor = args.editor;

                const sprite = this.getSprite(args);

                const data: IOriginToolSpriteData = {
                    x: this._position_1.x,
                    y: this._position_1.y,
                    originX: this._origin_1.x,
                    originY: this._origin_1.y
                };

                sprite.setData("OriginTool.initData", data);

                editor.getUndoManager().add(new OriginOperation(args));
            }

            this._initCursorPos = null;
        }

        getPoint(args: editor.tools.ISceneToolContextArgs) {

            const { x, y } = this.getAvgScreenPointOfObjects(args);

            return {
                x: this._axis === "x" ? x + 100 : x,
                y: this._axis === "y" ? y + 100 : y
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
                    args.canEdit ? "#fff" : editor.tools.SceneTool.COLOR_CANNOT_EDIT);

                ctx.restore();

            } else {

                ctx.save();

                ctx.translate(x, y);

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