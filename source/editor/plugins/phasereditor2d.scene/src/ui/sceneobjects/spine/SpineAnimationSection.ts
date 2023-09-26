namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineAnimationSection extends SceneGameObjectSection<SpineObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.SpineAnimartionSection", "Spine Animation", false, true);
        }

        protected getSectionHelpPath() {
            
            return "scene-editor/spine-animations-game-object-animations.html";
        }

        createForm(parent: HTMLDivElement): void {

            const comp = this.createGridElement(parent, 3);

            this.createPropertyFloatRow(comp, SpineComponent.timeScale);

            this.createPropertyFloatRow(comp, SpineComponent.defaultMix);

            {
                // Mixes

                this.createLock(comp, SpineComponent.animationMixes);

                this.createLabel(comp, "Mixes", PhaserHelp("phaser:spine.AnimationStateData.setMixWith"));

                const btn = this.createButton(comp, "Configure", () => {

                    const dlg = new SpineGameObjectPreviewDialog(this.getSelectionFirstElement());

                    dlg.create();
                });

                this.addUpdater(() => {

                    const obj = this.getSelectionFirstElement();

                    const count = (obj.animationMixes || []).length;

                    btn.textContent = `${count} mix${count === 1 ? "" : "es"}`;
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