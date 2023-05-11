namespace phasereditor2d.scene.ui.sceneobjects {

    export class EllipseHitAreaOffsetToolItem extends BaseHitAreaOffsetToolItem {

        constructor(x: IAxisFactor, y: IAxisFactor) {
            super(HitAreaShape.ELLIPSE, x, y);
        }

        override getPoint(args: editor.tools.ISceneToolContextArgs): { x: number; y: number; } {
            
            return this.getAvgScreenPointOfObjects(args,

                (sprite: sceneobjects.Image) => this._x - sprite.getEditorSupport().computeOrigin().originX,

                (sprite: sceneobjects.Image) => this._y - sprite.getEditorSupport().computeOrigin().originY,
            );
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