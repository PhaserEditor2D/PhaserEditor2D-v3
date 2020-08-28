namespace phasereditor2d.animations.ui.editors.properties {

    import controls = colibri.ui.controls;

    export class AnimationSection extends controls.properties.PropertySection<Phaser.Animations.Animation> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.animations.ui.editors.properties.AnimationSection", "Animation");
        }

        private help(key: string) {

            return AnimationsPlugin.getInstance().getPhaserDocs().getDoc("Phaser.Types.Animations.Animation." + key);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            {
                this.createLabel(comp, "Key", this.help("key"));
                const text = this.createText(comp);

                this.addUpdater(() => {

                    text.value = this.flatValues_StringJoin(this.getSelection().map(a => a.key));
                    text.readOnly = this.getSelection().length > 1;
                });
            }

            this.numberProperty(comp, "frameRate", "Frame Rate", 24);

            this.numberProperty(comp, "delay", "Delay", 0);

            this.numberProperty(comp, "repeat", "Repeat", 0);

            this.numberProperty(comp, "repeatDelay", "Repeat Delay", 0);
        }

        private numberProperty(parent: HTMLElement, field: string, labelText: string, defValue: number) {

            const label = this.createLabel(parent, labelText, this.help(field));
            const text = this.createText(parent);

            text.addEventListener("change", e => {

                let value = Number.parseInt(text.value, 10);

                if (isNaN(value)) {

                    value = defValue;
                }

                this.getEditor().runOperation(() => {

                    for (const anim of this.getSelection()) {

                        anim[field] = value;
                    }
                });
            });

            this.addUpdater(() => {

                text.value = this.flatValues_Number(this.getSelection().map(a => a[field]));
            });
        }

        private getEditor() {

            return colibri.Platform.getWorkbench().getActiveEditor() as AnimationsEditor;
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Phaser.Animations.Animation;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}