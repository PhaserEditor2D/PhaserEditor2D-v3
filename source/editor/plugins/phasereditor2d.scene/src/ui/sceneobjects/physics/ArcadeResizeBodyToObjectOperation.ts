namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeResizeBodyToObjectOperation extends SceneGameObjectOperation<ISceneGameObject> {

        transformValue(obj: Sprite): any {

            let offsetX: number;
            let offsetY: number;
            let width: number;
            let height: number;
            let radius: number;

            const isCircle = ArcadeComponent.isCircleBody(obj);

            const objES = obj.getEditorSupport();

            const objSize = objES.computeSize();

            if (isCircle) {

                radius = objSize.width / 2;
                offsetX = objSize.width / 2 - radius;
                offsetY = objSize.height / 2 - radius;

            } else {

                offsetX = 0;
                offsetY = 0;
                width = objSize.width;
                height = objSize.height;
            }

            if (obj instanceof Container) {

                const origin = objES.computeDisplayOrigin();
                offsetX -= origin.displayOriginX;
                offsetY -= origin.displayOriginY;
            }

            return { offsetX, offsetY, width, height, radius, isCircle };
        }

        getValue(obj: ISceneGameObject) {

            const body = ArcadeComponent.getBody(obj);

            return {
                offsetX: body.offset.x,
                offsetY: body.offset.y,
                width: body.width,
                height: body.height,
                radius: ArcadeComponent.radius.getValue(obj),
                isCircle: ArcadeComponent.isCircleBody(obj)
            };
        }

        setValue(obj: ISceneGameObject, value: any): void {

            const body = ArcadeComponent.getBody(obj);

            body.setOffset(value.offsetX, value.offsetY);

            if (value.isCircle) {

                ArcadeComponent.radius.setValue(obj, value.radius);

            } else {

                ArcadeComponent.size.x.setValue(obj, value.width);
                ArcadeComponent.size.y.setValue(obj, value.height);
            }
        }
    }
}