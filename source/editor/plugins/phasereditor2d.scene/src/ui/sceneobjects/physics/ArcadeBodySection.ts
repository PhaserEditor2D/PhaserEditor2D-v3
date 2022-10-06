namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ArcadeBodySection extends SceneGameObjectSection<ISceneGameObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ArcadeSection", "Arcade Physics Body");
        }

        protected getSectionHelpPath() {
            
            return "scene-editor/arcade-physics-properties.html#arcade-physics-body-section";
        }

        createForm(parent: HTMLDivElement) {
            
            const comp = this.createGridElementWithPropertiesBoolXY(parent);

            this.createPropertyEnumRow(comp, ArcadeComponent.bodyType, false).style.gridColumn = "span 4";

            this.createPropertyBoolean(comp, ArcadeComponent.enable).checkElement.style.gridColumn = "span 4";
        }

        canEdit(obj: any, n: number): boolean {

            return n > 0 && GameObjectEditorSupport.hasObjectComponent(obj, ArcadeComponent);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}