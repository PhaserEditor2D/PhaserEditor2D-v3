namespace phasereditor2d.scene.ui.sceneobjects {

    export class CircleHitAreaSizeOperation extends editor.tools.SceneToolOperation<{ x: number, y: number }> {

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
                x: CircleHitAreaComponent.radius.getValue(obj),
                y: CircleHitAreaComponent.radius.getValue(obj)
            };
        }

        setValue(obj: ISceneGameObject, value: { x: number; y: number; }) {

            CircleHitAreaComponent.radius.setValue(obj, value.x / 2);
        }
    }
}