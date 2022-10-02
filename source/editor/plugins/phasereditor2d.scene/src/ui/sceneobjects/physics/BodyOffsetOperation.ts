namespace phasereditor2d.scene.ui.sceneobjects {

    export class BodyOffsetOperation extends editor.tools.SceneToolOperation<{ x: number, y: number }> {

        getInitialValue(obj: ISceneGameObject): { x: number; y: number; } {

            return ArcadeBodyOffsetToolItem.getInitialOffset(obj);
        }

        getFinalValue(obj: ISceneGameObject): { x: number; y: number; } {

            return {
                x: ArcadeComponent.offset.x.getValue(obj),
                y: ArcadeComponent.offset.y.getValue(obj)
            };
        }

        setValue(obj: ISceneGameObject, value: { x: number; y: number; }) {

            ArcadeComponent.offset.x.setValue(obj, value.x);
            ArcadeComponent.offset.y.setValue(obj, value.y);
        }
    }
}