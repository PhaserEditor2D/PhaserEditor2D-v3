/// <reference path="./object/properties/SceneGameObjectSection.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TextContentSection extends SceneGameObjectSection<ITextContentLikeObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor.scene.ui.sceneobjects.TextContentSection", "Text Content", false, false);
        }

        getSectionHelpPath() {

            return "scene-editor/text-property.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);

            comp.style.gridTemplateColumns = "auto auto 1fr";

            this.createLock(comp, TextContentComponent.text);

            this.createLabel(comp, TextContentComponent.text.label, PhaserHelp(TextContentComponent.text.tooltip));

            this.createStringField(comp, TextContentComponent.text, true, false, true);
        }

        canEdit(obj: any, n: number): boolean {

            return GameObjectEditorSupport.hasObjectComponent(obj, TextContentComponent);
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}