namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeCenterBodyOperation extends SceneGameObjectOperation<ISceneGameObject> {

        transformValue(obj: ISceneGameObject): any {

            const objES = obj.getEditorSupport();

            const body = ArcadeComponent.getBody(obj);

            let x: number;
            let y: number;

            const { width, height } = objES.computeSize();

            if (ArcadeComponent.isCircleBody(obj)) {

                const r = ArcadeComponent.radius.getValue(obj);

                x = width / 2 - r;
                y = height / 2 - r;

            } else {

                x = (width - body.width) / 2;
                y = (height - body.height) / 2;
            }

            if (obj instanceof Container) {

                const origin = objES.computeDisplayOrigin();
                x -= origin.displayOriginX;
                y -= origin.displayOriginY;
            }

            return { x, y };
        }

        getValue(obj: ISceneGameObject) {

            const body = ArcadeComponent.getBody(obj);

            return { ...body.offset };
        }

        setValue(obj: ISceneGameObject, value: any): void {

            const body = ArcadeComponent.getBody(obj);

            body.setOffset(value.x, value.y);
        }
    }
}