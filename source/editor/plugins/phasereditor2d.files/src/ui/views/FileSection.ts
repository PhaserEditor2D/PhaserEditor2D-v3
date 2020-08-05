namespace phasereditor2d.files.ui.views {

    import controls = colibri.ui.controls;
    import core = colibri.core;

    export class FileSection extends controls.properties.PropertySection<core.io.FilePath> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "files.FileSection", "File");
        }

        createForm(parent: HTMLDivElement) {
            const comp = this.createGridElement(parent, 2);
            {
                // Name

                this.createLabel(comp, "Name");
                const text = this.createText(comp, true);
                this.addUpdater(() => {
                    text.value = this.flatValues_StringJoin(this.getSelection().map(file => file.getName()));
                });
            }

            {
                // Full Name

                this.createLabel(comp, "Full Name");
                const text = this.createText(comp, true);
                this.addUpdater(() => {
                    text.value = this.flatValues_StringJoin(this.getSelection().map(file => file.getFullName()));
                });
            }

            {
                // Size

                this.createLabel(comp, "Size");
                const text = this.createText(comp, true);
                this.addUpdater(() => {

                    let total = 0;

                    for (const file of this.getSelection()) {
                        total += file.getSize();
                    }

                    text.value = filesize(total);
                });
            }

            {
                // Open

                const btn = this.createButton(comp, "Open File", () => {

                    for (const file of this.getSelection()) {

                        colibri.Platform.getWorkbench().openEditor(file);
                    }
                });

                btn.style.gridColumn = "1 / span 2";
                btn.style.justifySelf = "end";
            }

        }

        canEdit(obj: any): boolean {
            return obj instanceof core.io.FilePath;
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }
    }
}