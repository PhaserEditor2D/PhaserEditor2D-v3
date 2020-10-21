namespace colibri.ui.ide.properties {

    export abstract class BaseImagePreviewSection<T> extends controls.properties.PropertySection<T> {

        static createSectionForm(
            parent: HTMLElement, section: controls.properties.PropertySection<any>, getImage: () => controls.IImage) {

            parent.classList.add("ImagePreviewFormArea");

            const imgControl = new controls.ImageControl(ide.IMG_SECTION_PADDING);

            section.getPage().eventControlLayout.addListener(() => {

                imgControl.resizeTo();
            });

            parent.appendChild(imgControl.getElement());

            requestAnimationFrame(() => imgControl.resizeTo());

            section.addUpdater(() => {

                const img = getImage();

                imgControl.setImage(img);

                requestAnimationFrame(() => imgControl.resizeTo());
            });
        }

        createForm(parent: HTMLDivElement) {

            BaseImagePreviewSection.createSectionForm(parent, this, () => this.getSelectedImage());
        }

        protected abstract getSelectedImage(): controls.IImage;

        canEditNumber(n: number): boolean {
            return n === 1;
        }
    }
}