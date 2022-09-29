namespace phasereditor2d.scene.ui.sceneobjects {

    export class BodySizeOperation extends editor.tools.SceneToolOperation<{ x: number, y: number }> {

        constructor(
            toolArgs: editor.tools.ISceneToolContextArgs,
            private getInitialSize: (obj: ISceneGameObject) => { x: number, y: number }) {

            super(toolArgs);
        }

        getInitialValue(obj: ArcadeObject): { x: number; y: number; } {

            return this.getInitialSize(obj);
        }
    
        getFinalValue(obj: ArcadeObject): { x: number; y: number; } {

            return {
                x: ArcadeComponent.size.x.getValue(obj),
                y: ArcadeComponent.size.y.getValue(obj)
            };
        }

        setValue(obj: ArcadeObject, value: { x: number; y: number; }) {

            ArcadeComponent.size.x.setValue(obj, value.x);
            ArcadeComponent.size.y.setValue(obj, value.y);
        }
    }
}