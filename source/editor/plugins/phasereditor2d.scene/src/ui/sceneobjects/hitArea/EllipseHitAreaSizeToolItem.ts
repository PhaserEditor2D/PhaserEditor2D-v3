/// <reference path="./BaseHitAreaSizeToolItem.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    export class EllipseHitAreaSizeToolItem extends BaseHitAreaSizeToolItem {

        constructor(x: IAxisFactor, y: IAxisFactor) {
            super(HitAreaShape.ELLIPSE, x, y);
        }

        protected getToolOrigin(obj: ISceneGameObject): { originX: number; originY: number; } {

            return { originX: 0.5, originY: 0.5 };
        }

        private getHitAreaComp(obj: ISceneGameObject) {

            const objEs = obj.getEditorSupport();

            const comp = objEs.getComponent(EllipseHitAreaComponent) as EllipseHitAreaComponent;

            return comp;
        }

        protected computeSize(obj: ISceneGameObject): { width: number; height: number; } {

            const { width, height } = this.getHitAreaComp(obj);

            return { width, height };
        }

        protected getHitAreaOffset(obj: ISceneGameObject): { x: number; y: number; } {

            const { x, y } = this.getHitAreaComp(obj);

            return { x, y };
        }

        protected getDataKey(): string {

            return "EllipseHitAreaSizeToolItem";
        }

        protected getHitAreaSectionId(): string {

            return EllipseHitAreaSection.ID;
        }

        protected onDragValues(obj: ISceneGameObject, changeX: boolean, changeY: boolean, width: number, height: number) {

            const comp = this.getHitAreaComp(obj);

            if (changeX) {

                comp.width = width;
            }

            if (changeY) {

                comp.height = height;
            }
        }

        protected createStopDragOperation(args: editor.tools.ISceneToolDragEventArgs): colibri.ui.ide.undo.Operation {

            return new EllipseHitAreaSizeOperation(args, obj => this.getInitialSize(obj));
        }
    }
}