namespace phasereditor2d.scene.ui.sceneobjects {

    export class CircleOffsetOperation extends editor.tools.SceneToolOperation<{ x: number, y: number }> {

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
                x: CircleHitAreaComponent.x.getValue(obj),
                y: CircleHitAreaComponent.y.getValue(obj)
            };
        }

        setValue(obj: ISceneGameObject, value: { x: number; y: number; }) {

            CircleHitAreaComponent.x.setValue(obj, value.x);
            CircleHitAreaComponent.y.setValue(obj, value.y);
        }
    }
}