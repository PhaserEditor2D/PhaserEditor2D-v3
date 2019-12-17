namespace phasereditor2d.images.ui.editors {

    import ide = colibri.ui.ide;
    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    class ImageEditorFactory extends ide.EditorFactory {

        constructor() {
            super("phasereditor2d.ImageEditorFactory");
        }

        acceptInput(input: any): boolean {

            if (input instanceof io.FilePath) {

                const file = <io.FilePath>input;
                const contentType = ide.Workbench.getWorkbench().getContentTypeRegistry().getCachedContentType(file);
                
                if (contentType === webContentTypes.core.CONTENT_TYPE_IMAGE) {
                    return true;
                }
            }

            return false;
        }

        createEditor(): ide.EditorPart {
            return new ImageEditor();
        }

    }

    export class ImageEditor extends ide.FileEditor {

        private _imageControl: controls.ImageControl;

        constructor() {
            super("phasereditor2d.ImageEditor");
            this.addClass("ImageEditor");
        }

        static getFactory(): ide.EditorFactory {
            return new ImageEditorFactory();
        }

        protected onEditorInputContentChanged() {

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

        setInput(input: io.FilePath) {

            super.setInput(input);

            if (this._imageControl) {
                this.updateImage();
            }
        }
    }

}