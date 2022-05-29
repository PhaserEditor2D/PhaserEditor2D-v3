/// <reference path="../ParentGameObjectEditorSupport.ts"/>
namespace phasereditor2d.scene.ui.sceneobjects {

    export class ContainerEditorSupport extends ParentGameObjectEditorSupport<Container> {

        constructor(obj: Container, scene: Scene) {
            super(ContainerExtension.getInstance(), obj, scene);

            this.addComponent(new TransformComponent(obj));
            this.addComponent(new VisibleComponent(obj));
            this.addComponent(new AlphaSingleComponent(obj));
            this.addComponent(new ChildrenComponent(obj));
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

            const b = obj.getBounds();

            const originX = (obj.x - b.x) / b.width;
            const originY = (obj.y - b.y) / b.height;

            return { originX, originY };
        }

        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera) {

            const container = this.getObject();

            if (container.list.length === 0) {
                return [];
            }

            const minPoint = new Phaser.Math.Vector2(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
            const maxPoint = new Phaser.Math.Vector2(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

            const points: Phaser.Math.Vector2[] = [];

            for (const obj of container.getChildren()) {

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