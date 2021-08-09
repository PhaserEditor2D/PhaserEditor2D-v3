namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import json = phasereditor2d.scene.core.json;

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

            return (!this.isPrefabInstance() || this.getNestedActivePrefabInstances().length > 0)
                && this.getObject().visible;
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

        writeJSON(layerData: json.IObjectData) {

            super.writeJSON(layerData);

            ContainerEditorSupport.writeJSON_children(this.getObject(), layerData);
        }

        readJSON(layerData: json.IObjectData) {

            super.readJSON(layerData);

            ContainerEditorSupport.readJSON_children(this.getObject(), layerData);
        }

        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera) {

            const layer = this.getObject();

            if (layer.list.length === 0) {
                return [];
            }

            const minPoint = new Phaser.Math.Vector2(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
            const maxPoint = new Phaser.Math.Vector2(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

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
