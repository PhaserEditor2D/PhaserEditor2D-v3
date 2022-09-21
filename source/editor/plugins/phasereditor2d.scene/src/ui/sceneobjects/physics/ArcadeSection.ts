namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ArcadeSection extends SceneGameObjectSection<ArcadeObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "id", "Arcade Body");
        }

        createForm(parent: HTMLDivElement) {
            
            const comp = this.createGridElementWithPropertiesBoolXY(parent);

            this.createPropertyEnumRow(comp, ArcadeComponent.bodyType, false).style.gridColumn = "span 4";
        }

        canEdit(obj: any, n: number): boolean {

            return n > 0 && GameObjectEditorSupport.hasObjectComponent(obj, ArcadeComponent);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}