namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class TilemapTiledJSONSection extends BaseSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.TilemapTiledJSONSection", "Tilemap Tiled JSON", core.TILEMAP_TILED_JSON_TYPE);
        }

        canEdit(obj: any, n: number) {
            return super.canEdit(obj, n) && obj instanceof core.TilemapTiledJSONAssetPackItem;
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createFileField(comp, "URL", "url", core.contentTypes.CONTENT_TYPE_TILEMAP_TILED_JSON,
                "Phaser.Loader.LoaderPlugin.tilemapTiledJSON(url)");
        }
    }
}