namespace phasereditor2d.pack.ui.properties {

    import controls = colibri.ui.controls;

    export class AnimationsPreviewSection extends colibri.ui.ide.properties.BaseManyImagePreviewSection<core.BaseAnimationsAssetPackItem> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.properties.AnimationsPreviewSection", "Animations Preview", true);
        }

        protected override async getViewerInput() {

            const frames = this.getSelection().flatMap(obj => {

                return obj.getAnimations();
            });

            return frames;
        }

        protected override prepareViewer(viewer: controls.viewers.TreeViewer) {

            viewer.setLabelProvider(new viewers.AssetPackLabelProvider());
            viewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider(
                e => new viewers.AnimationConfigCellRenderer("square")));

            viewer.eventOpenItem.addListener((elem: pack.core.AnimationConfigInPackItem) => {

                AnimationsPreviewSection.openPreviewDialog(elem);
            });
        }

        static openPreviewDialog(elem: core.AnimationConfigInPackItem) {

            alert("Preview dialog not found.");
        }

        override canEdit(obj: any, n: number): boolean {

            return obj instanceof core.BaseAnimationsAssetPackItem;
        }

        override canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}