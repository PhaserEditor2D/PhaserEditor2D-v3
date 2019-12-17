namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class AudioSpriteSection extends BaseSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.AudioSpriteSection", "Audio Sprite");
        }

        canEdit(obj: any, n: number) {
            return super.canEdit(obj, n) && obj instanceof core.AudioSpriteAssetPackItem;
        }

        protected createForm(parent: HTMLDivElement) {
            
            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createFileField(comp, "JSON URL", "jsonURL", core.contentTypes.CONTENT_TYPE_AUDIO_SPRITE);

            this.createMultiFileField(comp, "Audio URL", "audioURL", webContentTypes.core.CONTENT_TYPE_AUDIO);
        }
    }
}