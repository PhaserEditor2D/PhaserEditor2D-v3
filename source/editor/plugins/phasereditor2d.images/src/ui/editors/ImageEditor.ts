namespace phasereditor2d.images.ui.editors {

    import ide = colibri.ui.ide;
    import controls = colibri.ui.controls;

    export class ImageEditor extends ide.FileEditor {

        private _imageControl: controls.ImageControl;
        static _factory: ide.ContentTypeEditorFactory;

        constructor() {
            super("phasereditor2d.ImageEditor", ImageEditor.getFactory());
            this.addClass("ImageEditor");
        }

        static getFactory() {

            return this._factory
                || (this._factory = new ide.ContentTypeEditorFactory("Image Editor",
                    webContentTypes.core.CONTENT_TYPE_IMAGE, () => new ImageEditor()));
        }

        protected onEditorInputContentChangedByExternalEditor() {
            // empty
        }

        async createPart() {

            this._imageControl = new controls.ImageControl();

            const container = document.createElement("div");
            container.classList.add("ImageEditorContainer");
            container.appendChild(this._imageControl.getElement());

            this.getElement().appendChild(container);

            this.updateImage();
        }

        private async updateImage() {

            const file = this.getInput();

            if (!file) {
                return;
            }

            const img = ide.Workbench.getWorkbench().getFileImage(file);

            this._imageControl.setImage(img);

            this._imageControl.repaint();

            const result = await img.preload();

            if (result === controls.PreloadResult.RESOURCES_LOADED) {
                this._imageControl.repaint();
            }

            this.dispatchTitleUpdatedEvent();
        }

        getIcon(): controls.IImage {

            const file = this.getInput();

            if (!file) {
                return super.getIcon();
            }

            const img = ide.Workbench.getWorkbench().getFileImage(file);

            return img;
        }

        layout() {

            if (this._imageControl) {
                this._imageControl.resizeTo();
            }
        }
    }
}