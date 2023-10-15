namespace phasereditor2d.animations.ui.editors.properties {

    import controls = colibri.ui.controls;

    export class AnimationInfoSection
        extends controls.properties.PropertySection<pack.core.AnimationConfigInPackItem> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.animations.ui.editors.properties", "Animation Info", false);
        }

        createForm(parent: HTMLDivElement): void {

            const comp = this.createGridElement(parent, 2);

            {
                // Animation Key
                this.createLabel(comp, "Animation Key");

                const btn = this.createButton(comp, "", () => {

                    const anim = this.getSelectionFirstElement();

                    AnimationsPlugin.getInstance().openAnimationInEditor(anim);
                });

                this.addUpdater(() => {

                    const anim = this.getSelectionFirstElement();

                    btn.textContent = anim.getKey();
                });
            }

            {
                // Animations File
                this.createLabel(comp, "Animations File");

                const btn = this.createButton(comp, "", () => {

                    const file = this.getSelectionFirstElement().getParent().getAnimationsFile();

                    if (file) {

                        colibri.Platform.getWorkbench().openEditor(file);
                    }
                });

                this.addUpdater(() => {

                    const anim = this.getSelectionFirstElement();

                    const file = anim.getParent().getAnimationsFile();

                    btn.textContent = file ?
                        file.getName() + " - " + file.getParent().getProjectRelativeName()
                        : "<not found>";
                });
            }

            {
                // preview button

                this.createButton(comp, "Preview Animation", async () => {

                    const elem = this.getSelectionFirstElement();

                    const animAsset = elem.getParent();
                    const animationKey = elem.getKey();

                    const dlg = new scene.ui.sceneobjects.AnimationPreviewDialog(
                        animAsset, {
                            key: animationKey
                        });

                    dlg.create();

                }).style.gridColumn = "span 2";
            }
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof pack.core.AnimationConfigInPackItem;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}