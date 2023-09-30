namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    interface ITilemapLayerReference {
        tilemap: Tilemap;
        layerName: string;
    }

    export class TilemapLayerExtension extends SceneGameObjectExtension {

        private static _instance: TilemapLayerExtension;

        static getInstance() {

            return this._instance ? this._instance : (this._instance = new TilemapLayerExtension());
        }

        constructor() {
            super({
                icon: resources.getIconDescriptor(resources.ICON_TILEMAP_LAYER),
                phaserTypeName: "Phaser.Tilemaps.TilemapLayer",
                typeName: "TilemapLayer",
                typeNameAlias: ["StaticTilemapLayer", "DynamicTilemapLayer"],
                category: SCENE_OBJECT_TILEMAP_CATEGORY,
            });
        }

        createTilemapLayer(scene: Scene, tilemap: Tilemap, layerName: string) {

            const layer = new TilemapLayer(scene, tilemap, layerName);

            return layer;
        }

        getCodeFactoryMethod(): string {

            return "createLayer";
        }

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

            const noImageTilesets = tilemaps

                .flatMap(tilemap => tilemap.tilesets)

                .filter(tileset => !tileset.image)

                .map(tileset => tileset.name);

            if (noImageTilesets.length > 0) {

                const names = `<ul>${noImageTilesets.map(n => `<li>${n}</li>`).join("")}</ul>`;

                return {
                    dataNotFoundMessage: "The following tilesets have no image:" + names
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

                viewer.setLabelProvider(new DialogLabelProvider());

                viewer.setCellRendererProvider(new DialogCellRendererProvider());

                viewer.setContentProvider(new DialogContentProvider(editor));

                // viewer.setTreeRenderer(new controls.viewers.TreeViewerRenderer(viewer));

                viewer.setInput([]);

                for (const tilemap of tilemaps) {

                    viewer.setExpanded(tilemap, true);
                }

                const dlg = new controls.dialogs.ViewerDialog(viewer, false);

                dlg.create();

                dlg.setTitle("Select Layer Name");

                dlg.enableButtonOnlyWhenOneElementIsSelected(

                    dlg.addOpenButton("Select", sel => {

                        const data = sel[0] as ITilemapLayerReference;

                        resolve({
                            data
                        });
                    }), obj => !(obj instanceof Tilemap)
                );

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

        getCodeDOMBuilder(): GameObjectCodeDOMBuilder {

            return new TilemapLayerCodeDOMBuilder(this.getCodeFactoryMethod());
        }

        createDefaultSceneObject(args: ICreateDefaultArgs) {

            const data = args.extraData as ITilemapLayerReference;

            const layer = this.createTilemapLayer(args.scene, data.tilemap, data.layerName);

            layer.setPosition(args.x, args.y);

            return [layer];
        }

        async getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]> {

            return [];
        }

        isAvailableAsPrefabElement() {

            return false;
        }

        override createInitObjectDataFromChild(childData: core.json.IObjectData): core.json.IObjectData {

            // This is a very very ugly solution for this issue:
            // https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/229
            // but making a bigger change in serialization at this moment could introduce a lot of bugs
            // and the TilemapLayer is a rare case in Phaser & the editor.
            // For example, you cannot create a prefab instance of a TilemapLayer

            return childData;
        }
    }

    class DialogLabelProvider implements controls.viewers.ILabelProvider {

        getLabel(element: ITilemapLayerReference | Tilemap) {

            if (element instanceof Tilemap) {

                return element.getTilemapAssetKey();
            }

            return `${element.layerName}`;
        }
    }

    class DialogCellRendererProvider implements controls.viewers.ICellRendererProvider {

        getCellRenderer(element: any): controls.viewers.ICellRenderer {

            if (element instanceof Tilemap) {

                return new controls.viewers.IconGridCellRenderer(
                    resources.getIcon(resources.ICON_TILEMAP));
            }

            return new controls.viewers.IconGridCellRenderer(
                resources.getIcon(resources.ICON_TILEMAP_LAYER));
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            return controls.PreloadResult.NOTHING_LOADED;
        }
    }

    class DialogContentProvider implements controls.viewers.ITreeContentProvider {

        private _editor: editor.SceneEditor;
        private _map: Map<Tilemap, any>;

        constructor(editor: ui.editor.SceneEditor) {

            this._editor = editor;
            this._map = new Map();
        }

        getRoots(input: any): any[] {

            const tilemaps = this._editor.getScene()
                .getPlainObjects()
                .filter(obj => obj instanceof Tilemap) as Tilemap[];

            return tilemaps;
        }

        getChildren(parent: any): any[] {

            if (parent instanceof Tilemap) {

                if (this._map.has(parent)) {

                    return this._map.get(parent);
                }

                const layers = parent.getTileLayerNames().map(layerName => {
                    return {
                        tilemap: parent,
                        layerName
                    } as ITilemapLayerReference;
                });

                this._map.set(parent, layers);

                return layers;
            }

            return [];
        }

    }
}