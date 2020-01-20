/// <reference path="../image/BaseImageEditorSupport.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class SpriteEditorSupport extends BaseImageEditorSupport<Sprite> {

        constructor(obj: Sprite) {
            super(SpriteExtension.getInstance(), obj);
        }
    }
}