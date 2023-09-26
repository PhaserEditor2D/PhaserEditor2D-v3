namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineBoundsProviderSection extends SceneGameObjectSection<SpineObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.SpineBoundsProviderSection", "Spine Bounds Provider", false, true);
        }

        protected getSectionHelpPath() {
            
            return "scene-editor/spine-animations-game-object-bounds.html";
        }

        createForm(parent: HTMLDivElement): void {

            const comp = this.createGridElement(parent, 3);

            this.createPropertyEnumRow(comp, SpineComponent.bpType);

            const btn1 = this.createPropertyEnumRow(comp, SpineComponent.bpSkin, false);

            const btn2 = this.createPropertyEnumRow(comp, SpineComponent.bpAnimation, false);

            const btn3 = this.createPropertyFloatRow(comp, SpineComponent.bpTimeStep, false);

            this.addUpdater(() => {

                let enable = false;

                const typeProp = SpineComponent.bpType;

                const unlockedObjs = this.getSelection()

                    .filter(obj => obj.getEditorSupport().isUnlockedProperty(typeProp));

                if (unlockedObjs.length !== this.getSelection().length) {

                    return;
                }

                for (const obj of this.getSelection()) {

                    const type = typeProp.getValue(obj);

                    if (type === BoundsProviderType.SKINS_AND_ANIMATION_TYPE) {

                        enable = true;

                        break;
                    }
                }

                btn1.disabled = !enable;
                btn2.disabled = !enable;
                btn3.disabled = !enable;
            });
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof SpineObject;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}