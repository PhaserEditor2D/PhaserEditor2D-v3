namespace phasereditor2d.files.ui.views {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import io = colibri.core.io;

    export class UploadSection extends controls.properties.PropertySection<io.FilePath> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.files.ui.views", "Upload");
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 1);
            comp.classList.add("UploadSection");
            comp.style.display = "grid";
            comp.style.gridTemplateColumns = "1fr";
            comp.style.justifySelf = "center";
            comp.style.gridGap = "5px";

            this.createButton(comp, "Upload Files To Folder", () => {

                const dlg = new dialogs.UploadDialog(this.getSelection()[0]);
                dlg.create();
            });
        }

        canEdit(obj: any, n: number): boolean {
            return obj instanceof io.FilePath && obj.isFolder();
        }

        canEditNumber(n: number): boolean {
            return n === 1;
        }
    }
}