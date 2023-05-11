namespace phasereditor2d.scene.ui.sceneobjects {

    export class RectangleHitAreaOffsetToolItem extends BaseHitAreaOffsetToolItem {

        constructor(x: IAxisFactor, y: IAxisFactor) {
            super(HitAreaShape.RECTANGLE, x, y);
        }

        protected getToolOrigin(obj: ISceneGameObject): { originX: number; originY: number; } {

            return { originX: 0, originY: 0 };
        }

        protected getOffsetProperties(obj: ISceneGameObject): { x: IProperty<ISceneGameObject>; y: IProperty<ISceneGameObject>; } {

            const { x, y } = RectangleHitAreaComponent;

            return { x, y };
        }

        protected getSizeProperties(obj: ISceneGameObject): { width: IProperty<ISceneGameObject>; height: IProperty<ISceneGameObject>; } {

            const { width, height } = RectangleHitAreaComponent;

            return { width, height };
        }

        protected getKeyData(): string {

            return "RectangleHitAreaOffsetToolItem";
        }

        protected getOffsetSectionId(): string {

            return RectangleHitAreaSection.ID;
        }

        protected createStopDragOperation(args: editor.tools.ISceneToolDragEventArgs): colibri.ui.ide.undo.Operation {

            return new RectangleOffsetOperation(args, obj => this.getInitialValue(obj))
        }
    }
}