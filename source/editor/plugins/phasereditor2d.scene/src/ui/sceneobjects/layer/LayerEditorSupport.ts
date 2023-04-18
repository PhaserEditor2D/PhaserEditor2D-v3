namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import json = phasereditor2d.scene.core.json;

    export class LayerEditorSupport extends DisplayParentGameObjectEditorSupport<Layer> {

        constructor(obj: Layer, scene: Scene) {
            super(LayerExtension.getInstance(), obj, scene);

            this.addComponent(
                new VisibleComponent(obj),
                new AlphaSingleComponent(obj),
                new ChildrenComponent(obj)
            );
        }

        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera) {

            const children = this.getObjectChildren();

            if (children.length === 0) {

                return [];
            }

            const minPoint = new Phaser.Math.Vector2(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
            const maxPoint = new Phaser.Math.Vector2(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

            const points: Phaser.Math.Vector2[] = [];

            for (const obj of children) {

                const bounds = obj.getEditorSupport().getScreenBounds(camera);

                points.push(...bounds);
            }

            for (const point of points) {

                minPoint.x = Math.min(minPoint.x, point.x);
                minPoint.y = Math.min(minPoint.y, point.y);
                maxPoint.x = Math.max(maxPoint.x, point.x);
                maxPoint.y = Math.max(maxPoint.y, point.y);
            }

            return [
                new Phaser.Math.Vector2(minPoint.x, minPoint.y),
                new Phaser.Math.Vector2(maxPoint.x, minPoint.y),
                new Phaser.Math.Vector2(maxPoint.x, maxPoint.y),
                new Phaser.Math.Vector2(minPoint.x, maxPoint.y)
            ];
        }
    }
}
