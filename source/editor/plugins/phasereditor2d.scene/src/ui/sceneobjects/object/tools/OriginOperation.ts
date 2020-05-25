/// <reference path="../../../editor/tools/SceneToolOperation.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class OriginOperation extends editor.tools.SceneToolOperation<{ x: number, y: number }> {

        getInitialValue(obj: any): IOriginToolSpriteData {

            return OriginToolItem.getInitObjectOriginAndPosition(obj);
        }

        getFinalValue(obj: any): IOriginToolSpriteData {

            return OriginToolItem.createFinalData(obj);
        }

        setValue(obj: any, value: IOriginToolSpriteData) {

            const sprite = obj as Phaser.GameObjects.Sprite;

            sprite.x = value.x;
            sprite.y = value.y;
            sprite.setOrigin(value.originX, value.originY);
        }
    }
}