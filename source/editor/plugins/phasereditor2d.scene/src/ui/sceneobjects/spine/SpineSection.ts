namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineSection extends SceneGameObjectSection<SpineObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.SpineSection", "Spine");
        }

        createForm(parent: HTMLDivElement): void {

            const comp = this.createGridElement(parent, 3);

            this.createPropertyEnumRow(comp, SpineComponent.skin);

            this.createPropertyEnumRow(comp, SpineComponent.boundsProviderType);

            const btn1 = this.createPropertyEnumRow(comp, SpineComponent.boundsProviderSkin, false);

            const btn2 = this.createPropertyEnumRow(comp, SpineComponent.boundsProviderAnimation, false);

            const btn3 = this.createPropertyFloatRow(comp, SpineComponent.boundsProviderTimeStep, false);

            this.addUpdater(() => {

                let enable = false;

                const typeProp = SpineComponent.boundsProviderType;

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

        canEditAll(selection: SpineObject[]): boolean {

            const first = selection[0];

            const { dataKey } = first;

            for (const obj of selection) {

                if (obj.dataKey !== dataKey) {

                    return false;
                }
            }

            return true;
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof SpineObject;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}