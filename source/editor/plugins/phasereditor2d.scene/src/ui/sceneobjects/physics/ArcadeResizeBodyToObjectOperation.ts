namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeResizeBodyToObjectOperation extends SceneGameObjectOperation<ISceneGameObject> {

        transformValue(obj: ArcadeObject): any {

            let offsetX: number;
            let offsetY: number;
            let width: number;
            let height: number;
            let radius: number;

            const isCircle = ArcadeComponent.isCircleBody(obj);

            if (isCircle) {

                radius = obj.width / 2;
                offsetX = obj.width / 2 - radius;
                offsetY = obj.height / 2 - radius;

            } else {

                offsetX = 0;
                offsetY = 0;
                width = obj.width;
                height = obj.height;
            }

            return { offsetX, offsetY, width, height, radius, isCircle };
        }

        getValue(obj: ArcadeObject) {

            return {
                offsetX: obj.body.offset.x,
                offsetY: obj.body.offset.y,
                width: obj.body.width,
                height: obj.body.height,
                radius: ArcadeComponent.radius.getValue(obj),
                isCircle: ArcadeComponent.isCircleBody(obj)
            };
        }

        setValue(obj: ArcadeObject, value: any): void {

            obj.body.setOffset(value.offsetX, value.offsetY);

            if (value.isCircle) {

                ArcadeComponent.radius.setValue(obj, value.radius);

            } else {

                ArcadeComponent.size.x.setValue(obj, value.width);
                ArcadeComponent.size.y.setValue(obj, value.height);
            }
        }
    }
}