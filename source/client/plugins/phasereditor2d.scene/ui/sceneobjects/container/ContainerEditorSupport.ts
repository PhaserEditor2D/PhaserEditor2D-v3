namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ContainerData extends json.ObjectData {
        list: json.ObjectData[];
    }

    export class ContainerEditorSupport extends EditorSupport<Container> {

        constructor(obj: Container) {
            super(ContainerExtension.getInstance(), obj);

            this.addSerializer(new TransformSupport(obj));
        }

        writeJSON(data: ContainerData) {

            super.writeJSON(data);

            data.list = this.getObject().list.map(obj => {

                const objData = {};

                obj.getEditorSupport().writeJSON(objData);

                return objData as json.ObjectData;
            });
        }

        readJSON(data: ContainerData) {

            super.readJSON(data);

            const maker = this.getScene().getMaker();

            const obj = this.getObject();

            for (const objData of data.list) {

                const sprite = maker.createObject(objData);

                obj.add(sprite);
            }
        }

        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera) {

            const container = this.getObject();

            if (container.list.length === 0) {
                return [];
            }

            const minPoint = new Phaser.Math.Vector2(Number.MAX_VALUE, Number.MAX_VALUE);
            const maxPoint = new Phaser.Math.Vector2(Number.MIN_VALUE, Number.MIN_VALUE);

            for (const obj of container.list) {

                const bounds = obj.getEditorSupport().getScreenBounds(camera);

                for (const point of bounds) {
                    minPoint.x = Math.min(minPoint.x, point.x);
                    minPoint.y = Math.min(minPoint.y, point.y);
                    maxPoint.x = Math.max(maxPoint.x, point.x);
                    maxPoint.y = Math.max(maxPoint.y, point.y);
                }
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