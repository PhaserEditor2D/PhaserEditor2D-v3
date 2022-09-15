/// <reference path="./object/properties/SceneGameObjectSection.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ChildrenSection extends SceneGameObjectSection<Container> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ChildrenSection", "Children", false, true);
        }

        getSectionHelpPath() {

            return "scene-editor/container-object.html#container-properties";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "auto auto 1fr";

            this.createPropertyBoolean(comp, ChildrenComponent.allowPickChildren, false);

            this.createPropertyBoolean(comp, ChildrenComponent.showChildrenInOutline, false);

            {
                const label = this.createLabel(comp, "Prefab Instances:");
                label.style.gridColumn = "2 / span 2";
                label.style.opacity = "0.5";
                label.style.fontWeight = "bold";
                label.style.justifySelf = "left";
            }

            this.createPropertyBoolean(comp, ChildrenComponent.allowAppendChildren, true);
        }

        canEdit(obj: any, n: number): boolean {

            return GameObjectEditorSupport.hasObjectComponent(obj, ChildrenComponent);
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }
    }

}