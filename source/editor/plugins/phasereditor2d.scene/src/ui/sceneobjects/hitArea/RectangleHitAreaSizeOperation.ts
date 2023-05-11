namespace phasereditor2d.scene.ui.sceneobjects {

    export class RectangleHitAreaSizeOperation extends editor.tools.SceneToolOperation<{ x: number, y: number }> {

        constructor(
            toolArgs: editor.tools.ISceneToolContextArgs,
            private getInitialSize: (obj: ISceneGameObject) => { x: number, y: number }) {

            super(toolArgs);
        }

        getInitialValue(obj: ISceneGameObject): { x: number; y: number; } {

            return this.getInitialSize(obj);
        }
    
        getFinalValue(obj: ISceneGameObject): { x: number; y: number; } {

            return {
                x: RectangleHitAreaComponent.width.getValue(obj),
                y: RectangleHitAreaComponent.height.getValue(obj)
            };
        }

        setValue(obj: ISceneGameObject, value: { x: number; y: number; }) {

            RectangleHitAreaComponent.width.setValue(obj, value.x);
            RectangleHitAreaComponent.height.setValue(obj, value.y);
        }
    }
}