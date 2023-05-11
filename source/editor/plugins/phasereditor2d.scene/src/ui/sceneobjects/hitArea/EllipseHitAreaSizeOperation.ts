namespace phasereditor2d.scene.ui.sceneobjects {

    export class EllipseHitAreaSizeOperation extends editor.tools.SceneToolOperation<{ x: number, y: number }> {

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
                x: EllipseHitAreaComponent.width.getValue(obj),
                y: EllipseHitAreaComponent.height.getValue(obj)
            };
        }

        setValue(obj: ISceneGameObject, value: { x: number; y: number; }) {

            EllipseHitAreaComponent.width.setValue(obj, value.x);
            EllipseHitAreaComponent.height.setValue(obj, value.y);
        }
    }
}