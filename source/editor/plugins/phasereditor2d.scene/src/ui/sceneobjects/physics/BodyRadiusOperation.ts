namespace phasereditor2d.scene.ui.sceneobjects {

    export class BodyRadiusOperation extends editor.tools.SceneToolOperation<number> {

        constructor(
            toolArgs: editor.tools.ISceneToolContextArgs,
            private getInitialRadius: (obj: ISceneGameObject) => number) {

            super(toolArgs);
        }

        getInitialValue(obj: ArcadeObject): number {

            return this.getInitialRadius(obj);
        }
    
        getFinalValue(obj: ArcadeObject): number {

            return ArcadeComponent.radius.getValue(obj);
        }

        setValue(obj: ArcadeObject, value: number) {

            ArcadeComponent.radius.setValue(obj, value);
            obj.body.setCircle(value);
        }
    }
}