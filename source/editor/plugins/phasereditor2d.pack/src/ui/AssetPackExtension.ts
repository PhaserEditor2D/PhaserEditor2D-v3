namespace phasereditor2d.pack.ui {

    import controls = colibri.ui.controls;

    export abstract class AssetPackExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.pack.ui.AssetPackExtension";

        constructor() {
            super(AssetPackExtension.POINT_ID);
        }

        abstract getAssetPackItemTypes(): string[];

        abstract createImporters(): importers.Importer[];

        abstract getCellRenderer(element: any, layout: "grid" | "tree"): controls.viewers.ICellRenderer | undefined;

        abstract createEditorPropertySections(page: controls.properties.PropertyPage)
            : controls.properties.PropertySection<core.AssetPackItem>[];
    }
}