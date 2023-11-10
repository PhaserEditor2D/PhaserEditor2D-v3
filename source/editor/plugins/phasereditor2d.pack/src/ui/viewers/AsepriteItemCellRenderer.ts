namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;

    export class AsepriteItemCellRenderer extends controls.viewers.IconImageCellRenderer {

        constructor() {
            super(resources.getIcon(resources.ICON_ASEPRITE));
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {
            
            super.preload(args);

            return (args.obj as pack.core.AsepriteAssetPackItem).preload();
        }
    }
}