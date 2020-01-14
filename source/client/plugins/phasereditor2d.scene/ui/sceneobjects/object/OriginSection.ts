namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import core = colibri.core;

    export class OriginSection extends ObjectSceneSection<IOriginLike> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "SceneEditor.OriginSection", "Origin", false);
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

            this.createPropertyXYRow(comp, OriginComponent.origin);
        }

        canEdit(obj: any, n: number): boolean {
            return EditorSupport.getObjectComponent(obj, OriginComponent) !== null;
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }
    }

}