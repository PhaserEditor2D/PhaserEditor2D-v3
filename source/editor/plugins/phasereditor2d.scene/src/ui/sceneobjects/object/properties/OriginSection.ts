/// <reference path="./SceneGameObjectSection.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class OriginSection extends SceneGameObjectSection<IOriginLikeObject> {

        static SECTION_ID = "phasereditor2d.scene.ui.sceneobjects.OriginSection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, OriginSection.SECTION_ID, "Origin", false, true);
        }

        getSectionHelpPath() {

            return "scene-editor/origin-properties.html";
        }

        createMenu(menu: controls.Menu) {

            this.createToolMenuItem(menu, OriginTool.ID);

            menu.addSeparator();

            this.getEditor().getMenuCreator().createOriginMenuItems(menu);

            menu.addSeparator();

            super.createMenu(menu);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

            this.createPropertyXYRow(comp, OriginComponent.origin);
        }

        canEdit(obj: any, n: number): boolean {

            return GameObjectEditorSupport.hasObjectComponent(obj, OriginComponent);
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }
    }

}