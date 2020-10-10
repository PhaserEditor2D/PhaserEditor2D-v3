namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    interface ITilemapLayerReference {
        tilemap: Tilemap;
        layerName: string;
    }

    export abstract class BaseTilemapLayerExtension extends SceneGameObjectExtension {

        /**
         * Collect the data used to create a new, empty object. For example, a BitmapText requires
         * a BitmapFont key to be created, so this method opens a dialog to select the font.
         */
        async collectExtraDataForCreateDefaultObject(editor: ui.editor.SceneEditor): Promise<ICreateExtraDataResult> {

            const tilemaps = editor.getScene().getPlainObjects()
                .filter(o => o instanceof Tilemap) as Tilemap[];

            if (tilemaps.length === 0) {

                return {
                    dataNotFoundMessage: "First, you need to add a Tilemap object to the scene."
                };
            }

            const layers = tilemaps
                .flatMap(tilemap => tilemap.getTileLayerNames().map(layerName => {
                    return {
                        tilemap,
                        layerName
                    } as ITilemapLayerReference;
                }));

            if (layers.length === 0) {

                return {
                    dataNotFoundMessage: "No layers are available in the current tilemaps."
                };
            }

            if (layers.length === 1) {

                return {
                    data: layers[0]
                };
            }

            return new Promise((resolve, reject) => {

                const viewer = new controls.viewers.TreeViewer("phasereditor2d.scene.ui.sceneobjects.CollectExtraDataDialog");

                viewer.setLabelProvider(new controls.viewers.LabelProvider(
                    (element: ITilemapLayerReference) => {

                        return `${element.layerName} (${element.tilemap.getTilemapAssetKey()})`;
                    }));

                viewer.setCellRendererProvider(controls.viewers.EmptyCellRendererProvider.withIcon(this.getIcon()));

                viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

                viewer.setInput(layers);

                const dlg = new controls.dialogs.ViewerDialog(viewer, false);

                dlg.create();

                dlg.setTitle("Select Layer Name");

                dlg.enableButtonOnlyWhenOneElementIsSelected(

                    dlg.addOpenButton("Select", sel => {

                        const data = sel[0] as ITilemapLayerReference;

                        resolve({
                            data
                        });
                    }));

                dlg.addCancelButton();
            });
        }

        acceptsDropData(data: any): boolean {

            return false;
        }

        createSceneObjectWithAsset(args: ICreateWithAssetArgs): ISceneGameObject {
            throw new Error("Method not implemented.");
        }

        createGameObjectWithData(args: ICreateWithDataArgs): ISceneGameObject {

            const data = args.data as ITilemapLayerData;

            const scene = args.scene;

            const tilemap = scene.getPlainObjectById(data.tilemapId) as Tilemap;

            if (!tilemap) {

                throw new Error("Cannot find Tilemap with id " + data.tilemapId);
            }

            const layer = this.createTilemapLayer(scene, tilemap, data.layerName);

            layer.getEditorSupport().readJSON(data);

            return layer;
        }

        abstract createTilemapLayer(scene: Scene, tilemap: Tilemap, layerName: string): ISceneGameObject;

        abstract getCodeFactoryMethod(): string;

        getCodeDOMBuilder(): GameObjectCodeDOMBuilder {

            return new TilemapLayerCodeDOMBuilder(this.getCodeFactoryMethod());
        }

        createDefaultSceneObject(args: ICreateDefaultArgs): ISceneObject {

            const data = args.extraData as ITilemapLayerReference;

            const layer = this.createTilemapLayer(args.scene, data.tilemap, data.layerName);

            return layer;
        }

        async getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]> {

            return [];
        }

        isAvailableAsPrefabElement() {

            return false;
        }
    }
}