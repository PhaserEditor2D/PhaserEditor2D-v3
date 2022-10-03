/// <reference path="./BaseArcadeBodyOffsetToolItem.ts"/>
namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeBodyCircleOffsetToolItem
        extends BaseArcadeBodyOffsetToolItem {

        constructor() {
            super(0.5, 0.5);
        }

        protected computeSize(obj: ISceneGameObject): { width: any; height: any; } {

            const d = ArcadeComponent.radius.getValue(obj) * 2;

            return { width: d, height: d };
        }

        isValidFor(objects: ISceneGameObject[]): boolean {

            for (const obj of objects) {

                if (GameObjectEditorSupport.hasObjectComponent(obj, ArcadeComponent)) {

                    if (!ArcadeComponent.isCircleBody(obj as ISceneGameObject)) {

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