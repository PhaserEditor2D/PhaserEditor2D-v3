namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import json = core.json;

    export interface ContainerData extends json.ObjectData {
        list: json.ObjectData[];
    }

    export class ContainerEditorSupport extends EditorSupport<Container> {

        constructor(obj: Container) {
            super(ContainerExtension.getInstance(), obj);

            this.addComponent(new TransformComponent(obj));
        }

        async buildDependenciesHash(builder: ide.core.MultiHashBuilder) {

            super.buildDependenciesHash(builder);

            if (!this.isPrefabInstance()) {

                for (const obj of this.getObject().list) {

                    obj.getEditorSupport().buildDependenciesHash(builder);
                }
            }
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            if (this.isPrefabInstance()) {

                const finder = ScenePlugin.getInstance().getSceneFinder();

                const file = finder.getPrefabFile(this.getPrefabId());

                if (file) {

                    const image = SceneThumbnailCache.getInstance().getContent(file);

                    if (image) {

                        return new controls.viewers.ImageCellRenderer(image);
                    }
                }
            }

            return new controls.viewers.IconImageCellRenderer(ScenePlugin.getInstance().getIcon(ICON_GROUP));
        }

        writeJSON(containerData: ContainerData) {

            super.writeJSON(containerData);

            if (!this.isPrefabInstance()) {

                containerData.list = this.getObject().list.map(obj => {

                    const objData = {} as json.ObjectData;

                    obj.getEditorSupport().writeJSON(objData);

                    return objData as json.ObjectData;
                });
            }
        }

        readJSON(containerData: ContainerData) {

            super.readJSON(containerData);

            const ser = this.getSerializer(containerData);

            const list = ser.read("list", []) as json.ObjectData[];

            const maker = this.getScene().getMaker();

            const container = this.getObject();

            // TODO: why? this should be executed once
            container.removeAll(true);

            for (const objData of list) {

                const sprite = maker.createObject(objData);

                container.add(sprite);
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