namespace phasereditor2d.scene.ui.sceneobjects {

    export class ContainerOriginToolItem
        extends editor.tools.SceneToolItem implements editor.tools.ISceneToolItemXY {

        private _axis: "x" | "y" | "xy";
        private _initCursorPos: { x: number, y: number };
        private _worldPosition_1: Phaser.Math.Vector2;
        private _position_1: Phaser.Math.Vector2;
        private _localTx: Phaser.GameObjects.Components.TransformMatrix;
        private _worldTx: Phaser.GameObjects.Components.TransformMatrix;

        constructor(axis: "x" | "y" | "xy") {
            super();

            this._axis = axis;
        }

        isValidFor(objects: sceneobjects.ISceneObject[]) {

            return objects.length === 1 && objects[0] instanceof Container;
        }

        containsPoint(args: editor.tools.ISceneToolDragEventArgs): boolean {

            const point = this.getPoint(args);

            const d = Phaser.Math.Distance.Between(args.x, args.y, point.x, point.y);

            return d < 20;
        }

        onStartDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (this.containsPoint(args)) {

                const container = this.getContainer(args);

                this._initCursorPos = { x: args.x, y: args.y };

                this._position_1 = new Phaser.Math.Vector2(container.x, container.y);

                this._localTx = container.getLocalTransformMatrix();
                this._worldTx = container.getWorldTransformMatrix();

                this._worldPosition_1 = new Phaser.Math.Vector2();

                container.getWorldTransformMatrix().transformPoint(0, 0, this._worldPosition_1);

                for (const obj of container.list) {

                    const sprite = obj as Sprite;

                    sprite.setData("ContainerOriginTool.position", { x: sprite.x, y: sprite.y });
                }
            }
        }

        private getContainer(args: editor.tools.ISceneToolDragEventArgs) {

            return args.objects[0] as unknown as Container;
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

            const worldPoint = new Phaser.Math.Vector2(
                this._worldPosition_1.x + worldDx,
                this._worldPosition_1.y + worldDy
            );

            const container = this.getContainer(args);

            const localPoint = new Phaser.Math.Vector2();

            this._worldTx.applyInverse(worldPoint.x, worldPoint.y, localPoint);

            for (const child of container.list) {

                const sprite = child as Sprite;

                const { x, y } = sprite.getData("ContainerOriginTool.position");

                sprite.x = x - localPoint.x;
                sprite.y = y - localPoint.y;
            }

            const delta = new Phaser.Math.Vector2();

            this._localTx.transformPoint(localPoint.x, localPoint.y, delta);

            delta.x -= this._position_1.x;
            delta.y -= this._position_1.y;

            container.setPosition(
                this._position_1.x + delta.x,
                this._position_1.y + delta.y
            );

            args.editor.dispatchSelectionChanged();
        }

        static getInitObjectOriginAndPosition(obj: Phaser.GameObjects.Container) {

            return obj.getData("OriginTool.initData") as IOriginToolSpriteData;
        }

        static createFinalData(sprite: Phaser.GameObjects.Container) {

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

                const sprite = this.getContainer(args);

                //TODO: missing execute operation!
                
                // const data: IOriginToolSpriteData = {
                //     x: this._position_1.x,
                //     y: this._position_1.y,
                //     originX: this._origin_1.x,
                //     originY: this._origin_1.y
                // };

                // sprite.setData("OriginTool.initData", data);

                // editor.getUndoManager().add(new OriginOperation(args));
            }

            this._initCursorPos = null;
        }

        getPoint(args: editor.tools.ISceneToolContextArgs) {

            const container = args.objects[0] as Container;

            const point = new Phaser.Math.Vector2();

            container.getWorldTransformMatrix().transformPoint(0, 0, point);

            const { x, y } = args.camera.getScreenPoint(point.x, point.y);

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