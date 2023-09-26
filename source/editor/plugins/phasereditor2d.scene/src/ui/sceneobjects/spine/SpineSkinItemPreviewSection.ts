namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineSkinItemPreviewSection extends colibri.ui.ide.properties.BaseImagePreviewSection<pack.core.SpineSkinItem> {

        static ID = "phasereditor2d.scene.ui.sceneobjects.SpinePreviewSection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, SpineSkinItemPreviewSection.ID, "Spine Preview", true, false);
        }

        createMenu(menu: controls.Menu): void {
            
            super.createMenu(menu);

            ide.IDEPlugin.getInstance().createHelpMenuItem(menu, "scene-editor/spine-animations-assets-preview.html");
        }

        protected getSelectedImage(): controls.IImage {

            return ScenePlugin.getInstance()
                .getSpineThumbnailCache()
                .getContent(this.getSelectionFirstElement());
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof pack.core.SpineSkinItem;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}