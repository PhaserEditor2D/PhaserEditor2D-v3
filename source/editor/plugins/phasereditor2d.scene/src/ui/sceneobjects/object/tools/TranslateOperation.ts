/// <reference path="../../../editor/tools/SceneToolOperation.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class TranslateOperation extends editor.tools.SceneToolOperation<{ x: number, y: number }> {

        getInitialValue(obj: any): { x: number; y: number; } {

            return TranslateToolItem.getInitObjectPosition(obj);
        }

        getFinalValue(obj: any): { x: number; y: number; } {

            const sprite = obj as ITransformLikeObject;

            return { x: sprite.x, y: sprite.y };
        }

        setValue(obj: any, value: { x: number; y: number; }) {

            const sprite = obj as ITransformLikeObject;

            sprite.x = value.x;
            sprite.y = value.y;
        }
    }
}