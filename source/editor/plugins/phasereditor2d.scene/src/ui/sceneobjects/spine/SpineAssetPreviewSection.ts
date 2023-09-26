namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineAssetPreviewSection extends colibri.ui.ide.properties.BaseManyImagePreviewSection<pack.core.SpineAssetPackItem> {

        static ID = "phasereditor2d.scene.ui.sceneobjects.SpineAssetPreviewSection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, SpineAssetPreviewSection.ID, "Spine Preview", true, false);
        }

        hasMenu(): boolean {

            return true;
        }

        createMenu(menu: controls.Menu): void {
            
            super.createMenu(menu);

            ide.IDEPlugin.getInstance().createHelpMenuItem(menu, "scene-editor/spine-animations-assets-preview.html");
        }

        protected async getViewerInput(): Promise<unknown> {
            
            return this.getSelection().flatMap(obj => obj.getGuessSkinItems());
        }

        protected prepareViewer(viewer: controls.viewers.TreeViewer) {
            
            viewer.setLabelProvider(new ui.blocks.SceneEditorBlocksLabelProvider());
            viewer.setCellRendererProvider(new ui.blocks.SceneEditorBlocksCellRendererProvider());
            viewer.setCellSize(128, true);
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof pack.core.SpineAssetPackItem;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}