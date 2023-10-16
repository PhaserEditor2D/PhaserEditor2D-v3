namespace phasereditor2d.animations.ui.editors.properties {

    import controls = colibri.ui.controls;

    export class AnimationSection extends controls.properties.PropertySection<Phaser.Animations.Animation> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.animations.ui.editors.properties.AnimationSection", "Animation");
        }

        private help(key: string) {

            return AnimationsPlugin.getInstance().getPhaserDocs().getDoc("Phaser.Types.Animations.Animation." + key);
        }

        createMenu(menu: controls.Menu) {

            ide.IDEPlugin.getInstance().createHelpMenuItem(menu, "animations-editor");
        }

        hasMenu() {

            return true;
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            {
                this.createLabel(comp, "Key", this.help("key"));
                const text = this.createText(comp);

                text.addEventListener("change", e => {

                    const key = text.value;

                    if (key.trim().length > 0) {

                        const anim = this.getSelectionFirstElement();

                        this.getEditor().runOperation(() => {

                            anim.key = key;

                        }, true);

                    } else {

                        this.updateWithSelection();
                    }
                });

                this.addUpdater(() => {

                    text.value = this.flatValues_StringJoin(this.getSelection().map(a => a.key));

                    text.readOnly = this.getSelection().length > 1;
                });
            }

            this.createNumberProperty(comp, "frameRate", "Frame Rate", 24, false);

            this.createNumberProperty(comp, "delay", "Delay", 0);

            this.createNumberProperty(comp, "repeat", "Repeat", 0);

            this.createNumberProperty(comp, "repeatDelay", "Repeat Delay", 0);

            this.createBooleanProperty(comp, "yoyo", "Yoyo");

            this.createBooleanProperty(comp, "showBeforeDelay", "Show Before Delay");

            this.createBooleanProperty(comp, "showOnStart", "Show On Start");

            this.createBooleanProperty(comp, "hideOnComplete", "Hide On Complete");

            this.createBooleanProperty(comp, "skipMissedFrames", "Skip Missed Frames");
        }

        private createBooleanProperty(parent: HTMLElement, field: string, labelText: string) {

            const checkbox = this.createCheckbox(parent, this.createLabel(parent, labelText, this.help(field)));

            checkbox.addEventListener("change", e => {

                this.getEditor().runOperation(() => {

                    const value = checkbox.checked;

                    this.getSelection().forEach(a => a[field] = value);
                });
            });

            this.addUpdater(() => {

                checkbox.checked = this.flatValues_BooleanAnd(this.getSelection().map(a => a[field]));
            })
        }

        private createNumberProperty(parent: HTMLElement, field: string, labelText: string, defValue: number, integer = true) {

            this.createLabel(parent, labelText, this.help(field));

            const text = this.createText(parent);

            text.addEventListener("change", e => {

                let value = integer ? Number.parseInt(text.value, 10) : Number.parseFloat(text.value);

                if (isNaN(value)) {

                    value = defValue;
                    text.value = defValue.toString();
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