namespace phasereditor2d.pack.ui {

    import controls = colibri.ui.controls;

    export abstract class AssetPackViewerExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.pack.ui.AssetPackCellRendererExtension";

        constructor() {
            super(AssetPackViewerExtension.POINT_ID);
        }

        abstract acceptObject(obj: any): boolean;

        abstract getCellRenderer(obj: any): controls.viewers.ICellRenderer;

        abstract getLabel(obj: any): string;
    }
}