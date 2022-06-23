/// <reference path="../ShapeEditorSupport.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    export class EllipseEditorSupport extends ShapeEditorSupport<Ellipse> {

        constructor(scene: Scene, obj: Ellipse) {
            super(EllipseExtension.getInstance(), obj, scene);

            this.addComponent(
                new SizeComponent(obj),
                new EllipseComponent(obj)
            );
        }

        computeContentHash(): string {
            
            let hash = super.computeContentHash();

            hash += this.computeContentHashWithComponent(this.getObject(), EllipseComponent);
            
            return hash;
        }
    }
}