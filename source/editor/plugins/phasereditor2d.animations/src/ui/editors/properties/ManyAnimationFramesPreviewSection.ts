namespace phasereditor2d.animations.ui.editors.properties {

    import controls = colibri.ui.controls;

    export class ManyAnimationFramesPreviewSection extends colibri.ui.ide.properties.BaseManyImagePreviewSection<Phaser.Animations.AnimationFrame> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.animations.ui.editors.AnimationFramePreviewSection", "Frames Preview", true, false);
        }

        private getEditor() {

            return colibri.Platform.getWorkbench().getActiveEditor() as AnimationsEditor;
        }

        protected async getViewerInput() {

            return this.getSelection().map(frame => {

                const finder = this.getEditor().getScene().getMaker().getPackFinder();

                const image = finder.getAssetPackItemImage(frame.textureKey, frame.textureFrame);

                return image;

            }).filter(img => img !== null && img !== undefined);
        }

        protected prepareViewer(viewer: colibri.ui.controls.viewers.TreeViewer) {

            viewer.setCellRendererProvider(new pack.ui.viewers.AssetPackCellRendererProvider("grid"));
            viewer.setLabelProvider(new pack.ui.viewers.AssetPackLabelProvider());
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Phaser.Animations.AnimationFrame;
        }
    }
}