/// <reference path="./BaseArcadeBodySizeToolItem.ts"/>
namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeBodySizeToolItem
        extends BaseArcadeBodySizeToolItem {

        isValidFor(objects: ISceneGameObject[]): boolean {

            for (const obj of objects) {

                if (ArcadeComponent.isCircleBody(obj as ISceneGameObject)) {

                    return false;
                }
            }

            return true;
        }

        protected onDragValues(sprite: Sprite, changeX: boolean, changeY: boolean, width: number, height: number) {

            const widthProp = ArcadeComponent.size.x;
            const heightProp = ArcadeComponent.size.y;

            if (changeX) {

                widthProp.setValue(sprite, Math.floor(width));
            }

            if (changeY) {

                heightProp.setValue(sprite, Math.floor(height));
            }
        }

        protected getDataKey(): string {

            return "ArcadeBodySizeToolItem";
        }

        protected createStopDragOperation(args: editor.tools.ISceneToolDragEventArgs): colibri.ui.ide.undo.Operation {

            return new BodySizeOperation(args, obj => this.getInitialSize(obj));
        }
    }
}