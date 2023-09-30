namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class HitAreaSection extends SceneGameObjectSection<ISceneGameObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.HitAreaSection", "Hit Area");
        }

        protected getSectionHelpPath() {
            
            return "scene-editor/input-hit-area.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            const { hitAreaShape } = HitAreaComponent;

            const prop = { ...hitAreaShape };

            prop.setValue = (obj, value) => {

                hitAreaShape.setValue(obj, value);

                if (value !== HitAreaShape.NONE) {

                    const comp = HitAreaComponent.getShapeComponent(obj);

                    comp.setDefaultValues();
                }
            }

            this.createPropertyEnumRow(comp, prop, undefined, value => {

                if (value === HitAreaShape.PIXEL_PERFECT) {

                    for(const obj of this.getSelection()) {

                        if (!(obj instanceof Sprite) && !(obj instanceof Image)) {

                            return false;
                        }
                    }
                }

                return true;
            });
        }

        canEdit(obj: any, n: number): boolean {

            return GameObjectEditorSupport.hasObjectComponent(obj, HitAreaComponent);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}