namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import core = colibri.core;

    export class TextureSection extends editor.properties.SceneSection<sceneobjects.Image> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "SceneEditor.TextureSection", "Texture", true);
        }

        protected createForm(parent: HTMLDivElement) {
            parent.classList.add("ImagePreviewFormArea", "PreviewBackground");

            const imgControl = new controls.ImageControl(ide.IMG_SECTION_PADDING);

            this.getPage().addEventListener(controls.EVENT_CONTROL_LAYOUT, (e: CustomEvent) => {
                imgControl.resizeTo();
            });

            parent.appendChild(imgControl.getElement());
            setTimeout(() => imgControl.resizeTo(), 1);

            this.addUpdater(() => {

                const obj = this.getSelection()[0];

                const { key, frame } = obj.getEditorSupport().getTextureComponent().getTexture();

                const finder = new pack.core.PackFinder();

                finder.preload().then(() => {

                    const img = finder.getAssetPackItemImage(key, frame);

                    imgControl.setImage(img);

                    setTimeout(() => imgControl.resizeTo(), 1);
                });
            });
        }

        canEdit(obj: any, n: number): boolean {
            return EditorSupport.getObjectComponent(obj, TextureComponent) !== null;
        }

        canEditNumber(n: number): boolean {
            return n === 1;
        }
    }
}