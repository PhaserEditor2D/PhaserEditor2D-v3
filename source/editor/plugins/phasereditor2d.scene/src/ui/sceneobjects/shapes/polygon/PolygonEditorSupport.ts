/// <reference path="../ShapeEditorSupport.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    export class PolygonEditorSupport extends ShapeEditorSupport<Polygon> {

        constructor(scene: Scene, obj: Polygon) {
            super(PolygonExtension.getInstance(), obj, scene);

            this.addComponent(new PolygonComponent(obj));
        }
    }
}