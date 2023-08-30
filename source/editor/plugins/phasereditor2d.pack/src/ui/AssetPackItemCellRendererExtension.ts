namespace phasereditor2d.pack.ui {

    import controls = colibri.ui.controls;

    export abstract class AssetPackCellRendererExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.pack.ui.AssetPackCellRendererExtension";

        constructor() {
            super(AssetPackCellRendererExtension.POINT_ID);
        }

        abstract acceptObject(obj: any): boolean;

        abstract getCellRenderer(obj: any): controls.viewers.ICellRenderer;
    }
}