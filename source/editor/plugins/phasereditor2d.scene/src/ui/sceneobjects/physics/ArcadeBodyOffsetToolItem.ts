/// <reference path="./BaseArcadeBodyOffsetToolItem.ts"/>
namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeBodyOffsetToolItem
        extends BaseArcadeBodyOffsetToolItem implements editor.tools.ISceneToolItemXY {


        constructor(x: IAxisFactor, y: IAxisFactor) {
            super(x, y);
        }

        protected computeSize(obj: ISceneGameObject) {

            return {
                width: ArcadeComponent.size.x.getValue(obj),
                height: ArcadeComponent.size.y.getValue(obj)
            };
        }

        isValidFor(objects: ISceneGameObject[]): boolean {

            for (const obj of objects) {

                if (GameObjectEditorSupport.hasObjectComponent(obj, ArcadeComponent)) {

                    if (ArcadeComponent.isCircleBody(obj as ISceneGameObject)) {

                        return false;
                    }

                } else {

                    return false;
                }
            }

            return true;
        }
    }
}