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
                    sprite.setData("TranslateTool.objInitWorldPosition", worldPoint);
                }
            }
        }

        onDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (!this._initCursorPos) {
                return;
            }

            for (const obj of args.objects) {

                const sprite = obj as unknown as Phaser.GameObjects.Sprite;

                const worldDelta = this.getTranslationInAxisWorldDelta(
                    this._axis, this._initCursorPos.x, this._initCursorPos.y, args);

                const spriteWorldPosition1 =
                    sprite.getData("TranslateTool.objInitWorldPosition") as Phaser.Math.Vector2;

                const spriteWorldPosition2 = worldDelta.add(spriteWorldPosition1);

                args.editor.getScene().snapVector(spriteWorldPosition2);

                let spriteLocalPosition2 = new Phaser.Math.Vector2();

                if (sprite.parentContainer) {

                    sprite.parentContainer.getWorldTransformMatrix()
                        .applyInverse(spriteWorldPosition2.x, spriteWorldPosition2.y, spriteLocalPosition2);

                } else {

                    spriteLocalPosition2 = spriteWorldPosition2;
                }

                sprite.setPosition(Math.round(spriteLocalPosition2.x), Math.round(spriteLocalPosition2.y));
            }

            args.editor.updateInspectorViewSection(TransformSection.SECTION_ID);
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

            return this.getSimpleTranslationPoint(this._axis, args);
        }

        render(args: editor.tools.ISceneToolRenderArgs) {

            const { x, y } = this.getPoint(args);

            this.renderSimpleAxis(this._axis, x, y, "#ff0", args);
        }
    }
}