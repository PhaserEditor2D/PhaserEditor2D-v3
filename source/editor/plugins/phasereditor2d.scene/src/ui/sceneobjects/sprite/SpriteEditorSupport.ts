/// <reference path="../image/BaseImageEditorSupport.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class SpriteEditorSupport extends BaseImageEditorSupport<Sprite> {

        constructor(obj: Sprite, scene: Scene) {
            super(SpriteExtension.getInstance(), obj, scene);

            this.addComponent(new SpriteComponent(obj));
        }
    }
}