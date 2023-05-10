namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class HitAreaSection extends SceneGameObjectSection<ISceneGameObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.HitAreaSection", "Hit Area");
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            const { hitAreaShape } = HitAreaComponent;

            const prop = {...hitAreaShape};

            prop.setValue = (obj, value) => {

                hitAreaShape.setValue(obj, value);

                if (value === HitAreaShape.RECTANGLE) {

                    const comp = RectangleHitAreaComponent.getRectangleComponent(obj);

                    comp.setDefaultValues();
                }
            }

            this.createPropertyEnumRow(comp, prop);
        }

        canEdit(obj: any, n: number): boolean {

            return GameObjectEditorSupport.hasObjectComponent(obj, HitAreaComponent);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}