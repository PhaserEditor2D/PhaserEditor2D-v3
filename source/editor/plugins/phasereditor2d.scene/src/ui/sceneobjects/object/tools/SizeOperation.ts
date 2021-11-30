namespace phasereditor2d.scene.ui.sceneobjects {

    export class SizeOperation extends editor.tools.SceneToolOperation<{ x: number, y: number }> {

        getInitialValue(obj: any): { x: number; y: number; } {

            return SizeToolItem.getInitialSize(obj);
        }

        getFinalValue(obj: ISizeLikeObject): { x: number; y: number; } {

            const [w, h] = obj.getEditorSupport().getSizeProperties();

            return { x: w.getValue(obj), y: h.getValue(obj) };
        }

        setValue(obj: ISizeLikeObject, value: { x: number; y: number; }) {

            const [w, h] = obj.getEditorSupport().getSizeProperties();

            w.setValue(obj, value.x);
            h.setValue(obj, value.y);
        }
    }
}