namespace phasereditor2d.scene.ui.sceneobjects {

    export class BodyRadiusOperation extends editor.tools.SceneToolOperation<number> {

        constructor(
            toolArgs: editor.tools.ISceneToolContextArgs,
            private getInitialRadius: (obj: ISceneGameObject) => number) {

            super(toolArgs);
        }

        getInitialValue(obj: ISceneGameObject): number {

            return this.getInitialRadius(obj);
        }
    
        getFinalValue(obj: ISceneGameObject): number {

            return ArcadeComponent.radius.getValue(obj);
        }

        setValue(obj: ISceneGameObject, value: number) {

            ArcadeComponent.radius.setValue(obj, value);
            ArcadeComponent.getBody(obj).setCircle(value);
        }
    }
}