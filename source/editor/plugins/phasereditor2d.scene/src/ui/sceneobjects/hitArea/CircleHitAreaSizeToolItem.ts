/// <reference path="./BaseHitAreaSizeToolItem.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    export class CircleHitAreaSizeToolItem extends BaseHitAreaSizeToolItem {

        constructor() {
            super(HitAreaShape.CIRCLE, 1, 0.5);
        }

        protected getToolOrigin(obj: ISceneGameObject): { originX: number; originY: number; } {

            return { originX: 0.5, originY: 0.5 };
        }

        protected computeSize(obj: ISceneGameObject): { width: number; height: number; } {

            const { radius } = CircleHitAreaComponent.getCircleComponent(obj);

            return { width: radius * 2, height: radius * 2 };
        }

        protected getHitAreaOffset(obj: ISceneGameObject): { x: number; y: number; } {

            const { x, y } = CircleHitAreaComponent.getCircleComponent(obj);

            return { x, y };
        }

        protected getDataKey(): string {

            return "CircleHitAreaSizeToolItem";
        }

        protected getHitAreaSectionId(): string {

            return CircleHitAreaSection.ID;
        }

        protected onDragValues(obj: ISceneGameObject, changeX: boolean, changeY: boolean, width: number, height: number) {

            const comp = CircleHitAreaComponent.getCircleComponent(obj);

            if (changeX) {

                comp.radius = width / 2;
            }

            if (changeY) {

                comp.radius = height / 2;
            }
        }

        protected createStopDragOperation(args: editor.tools.ISceneToolDragEventArgs): colibri.ui.ide.undo.Operation {

            return new CircleHitAreaSizeOperation(args, obj => this.getInitialSize(obj));
        }
    }
}