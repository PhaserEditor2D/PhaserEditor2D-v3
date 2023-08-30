namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineSkinCellRenderer extends controls.viewers.ImageCellRenderer {

        constructor() {
            super();
        }

        getImage(obj: pack.core.SpineSkinItem): controls.IImage {

            const cache = ScenePlugin.getInstance().getSpineThumbnailCache();

            return cache.getImage(obj);
        }
    }
}