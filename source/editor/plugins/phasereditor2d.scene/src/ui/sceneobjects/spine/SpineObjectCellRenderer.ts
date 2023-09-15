namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineObjectCellRenderer implements controls.viewers.ICellRenderer {

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const cache = ScenePlugin.getInstance().getSpineThumbnailCache();

            const skinItem = this.findSkinItem(args.obj);

            if (!skinItem) {

                return;
            }

            const image = cache.getContent(skinItem);

            if (image) {

                image.paint(args.canvasContext, args.x, args.y, args.w, args.h, args.center);
            }
        }

        private findSkinItem(obj: SpineObject) {

            const packCache = obj.getEditorSupport().getScene().getPackCache();

            const spineAsset = packCache.findAsset(obj.dataKey) as pack.core.SpineAssetPackItem;

            const spineAtlasAsset = packCache.findAsset(obj.atlasKey) as pack.core.SpineAtlasAssetPackItem;

            if (!spineAsset || !spineAtlasAsset) {

                return null;
            }

            const skin = obj.skeleton.skin || obj.skeleton.data.defaultSkin;

            if (!skin) {

                return null;
            }

            const skinName = skin.name;

            // const skinItem = spineAsset.getGuessSkinItems().find(s => s.skinName === skinName);

            const skinItem = new pack.core.SpineSkinItem(spineAsset, spineAtlasAsset, skinName);

            return skinItem;
        }

        cellHeight(args: controls.viewers.RenderCellArgs): number {

            return args.viewer.getCellSize();
        }

        preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            const cache = ScenePlugin.getInstance().getSpineThumbnailCache();

            const skinItem = this.findSkinItem(args.obj);

            if (!skinItem) {

                return controls.Controls.resolveResourceLoaded();
            }

            return cache.preload(skinItem);
        }
    }
}