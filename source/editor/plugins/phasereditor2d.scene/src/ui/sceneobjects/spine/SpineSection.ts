namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineSection extends SceneGameObjectSection<SpineObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.SpineSection", "Spine");
        }

        createForm(parent: HTMLDivElement): void {

            const comp = this.createGridElement(parent, 3);

            this.createPropertyEnumRow(comp, SpineComponent.skin);
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