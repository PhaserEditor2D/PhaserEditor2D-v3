namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class BaseHitAreaToolItem extends editor.tools.SceneToolItem {

        private _shape: HitAreaShape;

        constructor(shape: HitAreaShape) {
            super();

            this._shape = shape;
        }

        isValidFor(objects: ISceneGameObject[]): boolean {

            if (EditHitAreaTool.isValidFor(...objects)) {

                for (const obj of objects) {

                    if (HitAreaComponent.getShape(obj) === this._shape) {

                        return true;
                    }
                }
            }

            return false;
        }
    }
}