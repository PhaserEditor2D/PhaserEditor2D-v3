/// <reference path="./BaseArcadeBodySizeToolItem.ts"/>
namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeBodyRadiusToolItem
        extends BaseArcadeBodySizeToolItem {

        constructor() {
            super(1, 0.5);
        }

        protected computeSize(obj: ISceneGameObject): { width: any; height: any; } {

            const d = ArcadeComponent.radius.getValue(obj) * 2;

            return { width: d, height: d };
        }

        protected onDragValues(sprite: Sprite, changeX: boolean, changeY: boolean, width: number, height: number) {

            const radius = width / 2;

            ArcadeComponent.radius.setValue(sprite, Math.floor(radius));
        }

        isValidFor(objects: ISceneGameObject[]): boolean {

            for (const obj of objects) {

                if (!ArcadeComponent.isCircleBody(obj as ISceneGameObject)) {

                    return false;
                }
            }

            return true;
        }

        protected getDataKey(): string {

            return "ArcadeBodyRadiusToolItem";
        }

        protected createStopDragOperation(args: editor.tools.ISceneToolDragEventArgs): colibri.ui.ide.undo.Operation {

            return new BodyRadiusOperation(args, obj => this.getInitialSize(obj).x / 2);
        }
    }
}