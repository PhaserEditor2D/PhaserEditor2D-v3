namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineAnimationsSection extends SceneGameObjectSection<SpineObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.SpineAnimartionsSection", "Spine Animations", false, true);

        }

        createForm(parent: HTMLDivElement): void {

            const comp = this.createGridElement(parent, 3);

            {
                // Mixes

                this.createLock(comp, SpineComponent.animationMixes);

                this.gridColumn(comp, "Mixes", "The animation mixes.");

                const btn = this.createButton(comp, "Configure", () => {

                    const dlg = new SpineMixesDialog(this.getSelectionFirstElement());

                    dlg.create();
                });

                this.addUpdater(() => {

                    const count = (this.getSelectionFirstElement().animationMixes || []).length;
                    
                    btn.textContent = `Configure ${count} mixes`;
                });
            }
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof SpineObject;
        }

        canEditNumber(n: number): boolean {

            return n == 1;
        }
    }
}