namespace phasereditor2d.scene.ui {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class SceneFileSection extends controls.properties.PropertySection<io.FilePath> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.SceneFileSection", "Scene", true, false);
        }

        createForm(parent: HTMLDivElement) {

            const imgControl = new controls.ImageControl();

            this.getPage().eventControlLayout.addListener(() => {

                imgControl.resizeTo();
            });

            parent.appendChild(imgControl.getElement());

            this.addUpdater(async () => {

                const file = this.getSelectionFirstElement();

                const cache = SceneThumbnailCache.getInstance();

                await cache.preload(file);

                const image = SceneThumbnailCache.getInstance().getContent(file);

                imgControl.setImage(image);

                setTimeout(() => imgControl.resizeTo(), 1);
            });
        }

        canEdit(obj: io.FilePath, n: number): boolean {

            return obj instanceof io.FilePath
                && colibri.Platform.getWorkbench().getContentTypeRegistry()
                    .getCachedContentType(obj) === core.CONTENT_TYPE_SCENE;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}