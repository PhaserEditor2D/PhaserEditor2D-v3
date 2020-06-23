/// <reference path="../../../editor/properties/BaseSceneSection.ts"/>
/// <reference path="./SceneObjectSection.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TransformSection extends SceneObjectSection<sceneobjects.ITransformLikeObject> {

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.TransformSection", "Transform", false);
        }

        getSectionHelpPath() {

            return "scene-editor/transform-properties.html";
        }

        createMenu(menu: controls.Menu) {

            this.createToolMenuItem(menu, TranslateTool.ID);
            this.createToolMenuItem(menu, ScaleTool.ID);
            this.createToolMenuItem(menu, RotateTool.ID);

            menu.addSeparator();

            this.getEditor().getMenuCreator().createCoordsMenuItems(menu);

            menu.addSeparator();

            super.createMenu(menu);
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

            this.createPropertyXYRow(comp, TransformComponent.position, false);

            this.createPropertyXYRow(comp, TransformComponent.scale);

            this.createNumberPropertyRow(comp, TransformComponent.angle, false);
        }

        canEdit(obj: any, n: number): boolean {
            return EditorSupport.getObjectComponent(obj, TransformComponent) !== null && n > 0;
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }
    }
}