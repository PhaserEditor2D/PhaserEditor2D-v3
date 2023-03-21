namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;

    export class AssetPackGrouping {

        static GROUP_ASSETS_BY_TYPE = "type";
        static GROUP_ASSETS_BY_PACK = "pack";
        static GROUP_ASSETS_BY_LOCATION = "location";

        static GROUP_ASSET_TYPES = [
            AssetPackGrouping.GROUP_ASSETS_BY_TYPE,
            AssetPackGrouping.GROUP_ASSETS_BY_PACK,
            AssetPackGrouping.GROUP_ASSETS_BY_LOCATION,
        ];

        static GROUP_ASSET_TYPE_LABEL_MAP = {
            [AssetPackGrouping.GROUP_ASSETS_BY_TYPE]: "Type",
            [AssetPackGrouping.GROUP_ASSETS_BY_PACK]: "Asset Pack File",
            [AssetPackGrouping.GROUP_ASSETS_BY_LOCATION]: "Location"
        }

        static setGroupingPreference(groupType: string) {

            window.localStorage["phasereditor2d.scene.ui.blocks.SceneEditorBlocksProvider.assetGrouping"] = groupType;
        }

        static getGroupingPreference(): string {

            return window.localStorage["phasereditor2d.scene.ui.blocks.SceneEditorBlocksProvider.assetGrouping"]
                || AssetPackGrouping.GROUP_ASSETS_BY_TYPE;
        }

        static getItemFolder(item: pack.core.AssetPackItem) {

            const data = item.getData();

            let file: colibri.core.io.FilePath;

            if (typeof data.url === "string") {

                file = item.getFileFromAssetUrl(data.url);
            }

            if (!file) {

                file = item.getFileFromAssetUrl(data.atlasURL);
            }

            if (!file) {

                file = item.getPack().getFile();
            }

            return file.getParent();
        }

        static getAssetsFolders(packs: core.AssetPack[]) {

            return [...new Set(
                packs.flatMap(p => p.getItems())
                    .map(item => this.getItemFolder(item)))]
                .sort((a, b) => a.getFullName().length - b.getFullName().length);
        }

        static fillMenu(menu: controls.Menu, callback: (type?: string) => void) {

            const currentType = this.getGroupingPreference();

            for (const type of this.GROUP_ASSET_TYPES) {

                menu.addAction({
                    text: "Group Assets By " + this.GROUP_ASSET_TYPE_LABEL_MAP[type],
                    callback: () => {

                        this.setGroupingPreference(type);

                        callback(type);
                    },
                    selected: type === currentType
                });
            }
        }
    }
}