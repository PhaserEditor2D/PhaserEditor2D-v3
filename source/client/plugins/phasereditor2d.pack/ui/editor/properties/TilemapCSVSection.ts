namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class TilemapCSVSection extends BaseSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.TilemapCSVSection", "Tilemap CSV");
        }

        canEdit(obj: any, n: number) {
            return super.canEdit(obj, n) && obj instanceof core.TilemapCSVAssetPackItem;
        }

        protected createForm(parent: HTMLDivElement) {
            
            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createFileField(comp, "URL", "url", webContentTypes.core.CONTENT_TYPE_CSV);
        }
    }
}