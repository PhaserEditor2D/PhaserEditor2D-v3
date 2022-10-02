namespace phasereditor2d.scene.ui.sceneobjects {

    export class AlphaSingleSection extends SceneGameObjectSection<sceneobjects.IAlphaLikeObject> {

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.AlphaSingleSection", "Alpha", false, true);
        }

        getSectionHelpPath() {

            return "scene-editor/alpha-properties.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "auto auto 1fr";

            this.createNumberProperty(comp, AlphaComponent.alpha);
        }

        canEdit(obj: any, n: number): boolean {

            return GameObjectEditorSupport.hasObjectComponent(obj, AlphaSingleComponent) && n > 0;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}