namespace phasereditor2d.scene.ui.sceneobjects {

    export class BodySizeOperation extends editor.tools.SceneToolOperation<{ x: number, y: number }> {

        getInitialValue(obj: ArcadeObject): { x: number; y: number; } {

            return ArcadeBodySizeToolItem.getInitialSize(obj);
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