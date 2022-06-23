/// <reference path="../ShapeEditorSupport.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    export class PolygonEditorSupport extends ShapeEditorSupport<Polygon> {

        constructor(scene: Scene, obj: Polygon) {
            super(PolygonExtension.getInstance(), obj, scene);

            this.addComponent(new PolygonComponent(obj));
        }

        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera) {

            const polygon = this.getObject();

            let left = Number.MAX_VALUE;
            let right = Number.MIN_VALUE;
            let top = Number.MAX_VALUE;
            let bottom = Number.MIN_VALUE;

            let temp = new Phaser.Math.Vector2();

            for (const point of polygon.getPolygonGeom().points) {

                polygon.getWorldTransformMatrix().transformPoint(
                    point.x - polygon.displayOriginX, point.y - polygon.displayOriginY, temp);
                    
                temp = camera.getScreenPoint(temp.x, temp.y);

                left = Math.min(left, temp.x);
                right = Math.max(right, temp.x);
                top = Math.min(top, temp.y);
                bottom = Math.max(bottom, temp.y);
            }


            return [
                new Phaser.Math.Vector2(left, top),
                new Phaser.Math.Vector2(right, top),
                new Phaser.Math.Vector2(right, bottom),
                new Phaser.Math.Vector2(left, bottom)
            ];
        }


        computeContentHash(): string {
            
            let hash = super.computeContentHash();

            hash += this.computeContentHashWithComponent(this.getObject(), PolygonComponent);
            
            return hash;
        }
    }
}