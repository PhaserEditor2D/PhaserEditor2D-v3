namespace phasereditor2d.scene.ui.sceneobjects {

    export class EllipseOffsetOperation extends editor.tools.SceneToolOperation<{ x: number, y: number }> {

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
                x: EllipseHitAreaComponent.x.getValue(obj),
                y: EllipseHitAreaComponent.y.getValue(obj)
            };
        }

        setValue(obj: ISceneGameObject, value: { x: number; y: number; }) {

            EllipseHitAreaComponent.x.setValue(obj, value.x);
            EllipseHitAreaComponent.y.setValue(obj, value.y);
        }
    }
}