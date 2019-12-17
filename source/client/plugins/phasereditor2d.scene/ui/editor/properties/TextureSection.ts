namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import core = colibri.core;

    export class TextureSection extends SceneSection<gameobjects.EditorImage> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "SceneEditor.TextureSection", "Texture", true);
        }

        protected createForm(parent: HTMLDivElement) {
            parent.classList.add("ImagePreviewFormArea", "PreviewBackground");

            const imgControl = new controls.ImageControl(ide.IMG_SECTION_PADDING);

            this.getPage().addEventListener(controls.EVENT_CONTROL_LAYOUT, (e: CustomEvent) => {
                imgControl.resizeTo();
            })

            parent.appendChild(imgControl.getElement());
            setTimeout(() => imgControl.resizeTo(), 1);

            this.addUpdater(() => {

                const obj = this.getSelection()[0];

                const { key, frame } = obj.getEditorTexture();

                const finder = new pack.core.PackFinder();

                finder.preload().then(() => {

                    const img = finder.getAssetPackItemImage(key, frame);

                    imgControl.setImage(img);

                    setTimeout(() => imgControl.resizeTo(), 1);
                });
            });
        }

        canEdit(obj: any): boolean {
            return obj instanceof gameobjects.EditorImage;
        }

        canEditNumber(n: number): boolean {
            return n === 1;
        }


    }

}