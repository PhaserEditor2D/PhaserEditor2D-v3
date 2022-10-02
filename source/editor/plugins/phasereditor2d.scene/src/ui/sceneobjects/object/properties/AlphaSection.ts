namespace phasereditor2d.scene.ui.sceneobjects {

    export class AlphaSection extends SceneGameObjectSection<sceneobjects.IAlphaLikeObject> {

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.AlphaSection", "Alpha", false, true);
        }

        getSectionHelpPath() {

            return "scene-editor/alpha-properties.html";
            ;
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

            this.createNumberPropertyRow(comp, AlphaComponent.alpha, true);

            this.createPropertyXYRow(comp, AlphaComponent.alphaTop, true, false);

            this.createPropertyXYRow(comp, AlphaComponent.alphaBottom, true, false);
        }

        canEdit(obj: any, n: number): boolean {

            return GameObjectEditorSupport.hasObjectComponent(obj, AlphaComponent) && n > 0;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}