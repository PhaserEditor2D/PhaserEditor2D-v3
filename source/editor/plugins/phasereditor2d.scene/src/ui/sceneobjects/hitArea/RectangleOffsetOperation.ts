namespace phasereditor2d.scene.ui.sceneobjects {

    export class RectangleOffsetOperation extends editor.tools.SceneToolOperation<{ x: number, y: number }> {

        constructor(
            toolArgs: editor.tools.ISceneToolContextArgs,
            private getInitialOffset: (obj: ISceneGameObject) => { x: number, y: number }) {

            super(toolArgs);
        }

        getInitialValue(obj: ISceneGameObject): { x: number; y: number; } {

            return this.getInitialOffset(obj);
        }

        getFinalValue(obj: ISceneGameObject): { x: number; y: number; } {

            return {
                x: RectangleHitAreaComponent.x.getValue(obj),
                y: RectangleHitAreaComponent.y.getValue(obj)
            };
        }

        setValue(obj: ISceneGameObject, value: { x: number; y: number; }) {

            RectangleHitAreaComponent.x.setValue(obj, value.x);
            RectangleHitAreaComponent.y.setValue(obj, value.y);
        }
    }
}