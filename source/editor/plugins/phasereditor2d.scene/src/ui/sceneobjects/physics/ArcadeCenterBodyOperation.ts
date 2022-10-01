namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeCenterBodyOperation extends SceneGameObjectOperation<ISceneGameObject> {

        transformValue(obj: ArcadeObject): any {

            const body = obj.body;

            let x: number;
            let y: number;

            if (ArcadeComponent.isCircleBody(obj)) {

                const r = ArcadeComponent.radius.getValue(obj);

                x = obj.width / 2 - r;
                y = obj.height / 2 - r;

            } else {

                x = (obj.width - body.width) / 2;
                y = (obj.height - body.height) / 2;
            }

            return { x, y };
        }

        getValue(obj: ArcadeObject) {

            return { ...obj.body.offset };
        }

        setValue(obj: ArcadeObject, value: any): void {

            obj.body.setOffset(value.x, value.y);
        }
    }
}