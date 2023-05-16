namespace phasereditor2d.scene.ui.sceneobjects {

    export class EllipseHitAreaOffsetToolItem extends BaseHitAreaOffsetToolItem {

        constructor(x: IAxisFactor, y: IAxisFactor) {
            super(HitAreaShape.ELLIPSE, x, y);
        }

        protected getToolOrigin(obj: ISceneGameObject): { originX: number; originY: number; } {

            return { originX: 0.5, originY: 0.5 };
        }

        protected getOffsetProperties(obj: ISceneGameObject): { x: IProperty<ISceneGameObject>; y: IProperty<ISceneGameObject>; } {

            const { x, y } = EllipseHitAreaComponent;

            return { x, y };
        }

        protected getSizeProperties(obj: ISceneGameObject): { width: IProperty<ISceneGameObject>; height: IProperty<ISceneGameObject>; } {

            const { width, height } = EllipseHitAreaComponent;

            return { width, height };
        }

        protected getKeyData(): string {

            return "EllipseHitAreaOffsetToolItem";
        }

        protected getOffsetSectionId(): string {

            return EllipseHitAreaSection.ID;
        }

        protected createStopDragOperation(args: editor.tools.ISceneToolDragEventArgs): colibri.ui.ide.undo.Operation {

            return new EllipseOffsetOperation(args, obj => this.getInitialValue(obj));
        }
    }
}