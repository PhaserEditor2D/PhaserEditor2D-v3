namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;

    export class AnimationsItemCellRenderer extends controls.viewers.IconImageCellRenderer {

        constructor() {
            super(resources.getIcon(resources.ICON_ANIMATIONS));
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {
            
            super.preload(args);

            return (args.obj as pack.core.BaseAnimationsAssetPackItem).preload();
        }
    }
}