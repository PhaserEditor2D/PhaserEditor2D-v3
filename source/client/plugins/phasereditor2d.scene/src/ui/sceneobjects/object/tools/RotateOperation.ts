/// <reference path="../../../editor/tools/SceneToolOperation.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class RotateOperation extends editor.tools.SceneToolOperation<number> {

        getInitialValue(obj: any): number {

            return RotateToolItem.getInitialAngle(obj);
        }

        getFinalValue(obj: any): number {

            return (obj as ITransformLikeObject).angle;
        }

        setValue(obj: any, value: number) {

            (obj as ITransformLikeObject).angle = value;
        }
    }
}