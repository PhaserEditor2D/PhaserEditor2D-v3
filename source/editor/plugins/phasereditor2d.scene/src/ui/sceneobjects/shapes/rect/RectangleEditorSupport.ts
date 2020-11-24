/// <reference path="../ShapeEditorSupport.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    export class RectangleEditorSupport extends ShapeEditorSupport<Rectangle> {

        constructor(scene: Scene, obj: Rectangle) {
            super(RectangleExtension.getInstance(), obj, scene);

            this.addComponent(
                new SizeComponent(obj)
            );
        }
    }
}