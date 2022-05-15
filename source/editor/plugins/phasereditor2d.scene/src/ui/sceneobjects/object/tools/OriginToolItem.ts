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
        private _spriteWorldPosition_1: Phaser.Math.Vector2;
        private _spriteWorldTx_1: Phaser.GameObjects.Components.TransformMatrix;
        private _position_1: Phaser.Math.Vector2;
        private _localTx_1: Phaser.GameObjects.Components.TransformMatrix;
        private _origin_1: Phaser.Math.Vector2;

        constructor(axis: "x" | "y" | "xy") {
            super();

            this._axis = axis;
        }

        isValidFor(objects: sceneobjects.ISceneGameObject[]) {

            return objects.length === 1
                && objects[0].getEditorSupport().supportsOrigin();
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

                const { originX, originY } = sprite.getEditorSupport().computeOrigin();
                const { displayOriginX, displayOriginY } = sprite.getEditorSupport().computeDisplayOrigin();

                this._spriteWorldPosition_1 = worldPoint;
                this._spriteWorldTx_1 = tx;
                this._localTx_1 = sprite.getLocalTransformMatrix();
                this._displayOrigin_1 = new Phaser.Math.Vector2(displayOriginX, displayOriginY);
                this._origin_1 = new Phaser.Math.Vector2(originX, originY);
                this._position_1 = new Phaser.Math.Vector2(sprite.x, sprite.y);
            }
        }

        private getSprite(args: editor.tools.ISceneToolDragEventArgs) {

            return args.objects[0] as Sprite;
        }

        onDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (!this._initCursorPos) {
                return;
            }

            const sprite = this.getSprite(args);

            const worldDelta = this.getTranslationInAxisWorldDelta(
                this._axis, this._initCursorPos.x, this._initCursorPos.y, args);

            const worldPoint2 = this._spriteWorldPosition_1.clone().add(worldDelta);

            const displayOriginPoint_2 = new Phaser.Math.Vector2();
            this._spriteWorldTx_1.applyInverse(worldPoint2.x, worldPoint2.y, displayOriginPoint_2);

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

            args.editor.updateInspectorViewSection(sprite.getEditorSupport().getOriginSectionId());
        }

        static simpleChangeOriginKeepPosition(
            sprite: Sprite,
            newOriginX: number,
            newOriginY: number
        ) {

            const { displayOriginX, displayOriginY } = sprite.getEditorSupport().computeDisplayOrigin();

            this.changeOriginKeepPosition(
                sprite,
                displayOriginX,
                displayOriginY,
                newOriginX,
                newOriginY,
                sprite.getLocalTransformMatrix(),
                sprite.x,
                sprite.y
            );
        }

        static changeOriginKeepPosition(
            sprite: Sprite,
            displayOriginX_1: number,
            displayOriginY_1: number,
            originX_2: number,
            originY_2: number,
            localTx_1: Phaser.GameObjects.Components.TransformMatrix,
            x_1: number,
            y_1: number
        ) {

            sprite.setOrigin(originX_2, originY_2);

            const { displayOriginX, displayOriginY } = sprite.getEditorSupport().computeDisplayOrigin();

            const displayOriginDx = displayOriginX - displayOriginX_1;
            const displayOriginDy = displayOriginY - displayOriginY_1;

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

        static createFinalData(sprite: Sprite) {

            const { originX, originY } = sprite.getEditorSupport().computeOrigin();

            return {
                x: sprite.x,
                y: sprite.y,
                originX: originX,
                originY: originY
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

            return this.getSimpleTranslationPoint(this._axis, args);
        }

        render(args: editor.tools.ISceneToolRenderArgs) {

            const { x, y } = this.getPoint(args);

            this.renderSimpleAxis(this._axis, x, y, "#fff", args);
        }
    }
}