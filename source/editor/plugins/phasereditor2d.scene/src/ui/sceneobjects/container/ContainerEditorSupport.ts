/// <reference path="../DisplayParentGameObjectEditorSupport.ts"/>
namespace phasereditor2d.scene.ui.sceneobjects {

    export class ContainerEditorSupport extends DisplayParentGameObjectEditorSupport<Container> {

        constructor(obj: Container, scene: Scene) {
            super(ContainerExtension.getInstance(), obj, scene);

            this.addComponent(
                new TransformComponent(obj),
                new VisibleComponent(obj),
                new AlphaSingleComponent(obj),
                new ChildrenComponent(obj),
                new ArcadeComponent(obj, false));
        }

        computeSize(): { width: any; height: any; } {

            const obj = this.getObject();

            const b = obj.getBounds();

            return {
                width: b.width / obj.scaleX,
                height: b.height / obj.scaleY
            };
        }

        computeOrigin() {

            const obj = this.getObject();

            const bounds = obj.getBounds();

            let { x, y } = obj;

            if (obj.parentContainer) {

                const p = obj.parentContainer
                    .getBoundsTransformMatrix()
                    .transformPoint(obj.x, obj.y);

                x = p.x;
                y = p.y;
            }

            const originX = (x - bounds.x) / bounds.width;
            const originY = (y - bounds.y) / bounds.height;

            return { originX, originY };
        }

        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera) {

            const container = this.getObject();

            const children = this.getDisplayObjectChildren();

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

            const worldPoint = new Phaser.Math.Vector2(0, 0);

            container.getWorldTransformMatrix().transformPoint(0, 0, worldPoint);

            const p = camera.getScreenPoint(worldPoint.x, worldPoint.y);

            points.push(p);

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

        trim() {

            const container = this.getObject();

            if (container.length === 0) {

                return;
            }

            let minX = Number.MAX_SAFE_INTEGER;
            let minY = Number.MAX_SAFE_INTEGER;

            for (const child of container.list) {

                const sprite = child as unknown as Phaser.GameObjects.Sprite;

                minX = Math.min(sprite.x, minX);
                minY = Math.min(sprite.y, minY);
            }

            for (const child of container.list) {

                const sprite = child as unknown as Phaser.GameObjects.Sprite;

                sprite.x -= minX;
                sprite.y -= minY;
            }

            const p = new Phaser.Math.Vector2(0, 0);

            container.getWorldTransformMatrix().transformPoint(minX, minY, p);

            if (container.parentContainer) {

                container.parentContainer.getWorldTransformMatrix().applyInverse(p.x, p.y, p);
            }

            container.x = p.x;
            container.y = p.y;
        }
    }
}