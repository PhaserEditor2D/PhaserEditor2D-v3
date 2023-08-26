namespace phasereditor2d.scene.ui.viewers {

    import controls = colibri.ui.controls;

    const cache = new Map<string, controls.IImage>();

    export class SpineSkinCellRenderer extends controls.viewers.ImageCellRenderer {

        private _img: controls.IImage;

        constructor() {
            super();
        }

        getImage(obj: pack.core.SpineSkinItem): controls.IImage {

            const cache = ScenePlugin.getInstance().getSpineThumbnailCache();

            return cache.getImage(obj);
        }
    }
}