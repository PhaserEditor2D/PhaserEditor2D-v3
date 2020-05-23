namespace colibri.ui.ide.properties {

    export abstract class BaseImagePreviewSection<T> extends controls.properties.PropertySection<T> {

        protected createForm(parent: HTMLDivElement) {

            parent.classList.add("ImagePreviewFormArea");

            const imgControl = new controls.ImageControl(ide.IMG_SECTION_PADDING);

            this.getPage().eventControlLayout.addListener(() => {

                imgControl.resizeTo();
            });

            parent.appendChild(imgControl.getElement());

            setTimeout(() => imgControl.resizeTo(), 1);

            this.addUpdater(() => {

                const img = this.getSelectedImage();

                imgControl.setImage(img);

                setTimeout(() => imgControl.resizeTo(), 1);
            });
        }

        protected abstract getSelectedImage(): controls.IImage;

        canEditNumber(n: number): boolean {
            return n === 1;
        }
    }
}