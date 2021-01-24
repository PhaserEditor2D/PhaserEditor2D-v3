namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import json = phasereditor2d.scene.core.json;

    export interface ILayerData extends json.IObjectData {
        list: json.IObjectData[];
    }

    export class LayerEditorSupport extends GameObjectEditorSupport<Layer> {

        constructor(obj: Layer, scene: Scene) {
            super(LayerExtension.getInstance(), obj, scene);

            this.addComponent(
                new VisibleComponent(obj),
                new AlphaSingleComponent(obj)
            );
        }

        setInteractive(): void {
            // nothing
        }

        async buildDependencyHash(args: IBuildDependencyHashArgs) {

            super.buildDependencyHash(args);

            if (!this.isPrefabInstance()) {

                for (const obj of this.getObject().getChildren()) {

                    obj.getEditorSupport().buildDependencyHash(args);
                }
            }
        }

        isAllowPickChildren() {

            return !this.isPrefabInstance() && this.getObject().visible;
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

            return new controls.viewers.IconImageCellRenderer(ScenePlugin.getInstance().getIcon(ICON_LAYER));
        }

        writeJSON(layerData: ILayerData) {

            super.writeJSON(layerData);

            if (!this.isPrefabInstance()) {

                layerData.list = this.getObject().getChildren().map(obj => {

                    const objData = {} as json.IObjectData;

                    obj.getEditorSupport().writeJSON(objData);

                    return objData as json.IObjectData;
                });
            }
        }

        readJSON(layerData: ILayerData) {

            super.readJSON(layerData);

            const ser = this.getSerializer(layerData);

            const list = ser.read("list", []) as json.IObjectData[];

            const maker = this.getScene().getMaker();

            const layer = this.getObject();

            layer.removeAll(true);

            for (const objData of list) {

                const sprite = maker.createObject(objData);

                if (sprite) {

                    layer.add(sprite);
                }
            }
        }

        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera) {

            const layer = this.getObject();

            if (layer.list.length === 0) {
                return [];
            }

            const minPoint = new Phaser.Math.Vector2(Number.MAX_VALUE, Number.MAX_VALUE);
            const maxPoint = new Phaser.Math.Vector2(Number.MIN_VALUE, Number.MIN_VALUE);

            const points: Phaser.Math.Vector2[] = [];

            for (const obj of layer.getChildren()) {

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
