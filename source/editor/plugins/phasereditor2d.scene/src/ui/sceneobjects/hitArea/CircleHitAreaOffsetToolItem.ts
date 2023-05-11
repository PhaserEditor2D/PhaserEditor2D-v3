namespace phasereditor2d.scene.ui.sceneobjects {

    export class CircleHitAreaOffsetToolItem extends BaseHitAreaOffsetToolItem {

        constructor() {
            super(HitAreaShape.CIRCLE, 0.5, 0.5);
        }

        protected getToolOrigin(obj: ISceneGameObject): { originX: number; originY: number; } {

            return { originX: 0.5, originY: 0.5 };
        }

        protected getOffsetProperties(obj: ISceneGameObject): { x: IProperty<ISceneGameObject>; y: IProperty<ISceneGameObject>; } {

            const { x, y } = CircleHitAreaComponent;

            return { x, y };
        }

        protected getSizeProperties(obj: ISceneGameObject): { width: IProperty<ISceneGameObject>; height: IProperty<ISceneGameObject>; } {

            const { radius } = CircleHitAreaComponent;

            const prop = {...radius};

            prop.getValue = obj => radius.getValue(obj) * 2;

            return { width: prop, height: prop };
        }

        protected getKeyData(): string {

            return "CircleHitAreaOffsetToolItem";
        }

        protected getOffsetSectionId(): string {

            return CircleHitAreaSection.ID;
        }

        protected createStopDragOperation(args: editor.tools.ISceneToolDragEventArgs): colibri.ui.ide.undo.Operation {

            return new CircleOffsetOperation(args, obj => this.getInitialValue(obj));
        }
    }
}