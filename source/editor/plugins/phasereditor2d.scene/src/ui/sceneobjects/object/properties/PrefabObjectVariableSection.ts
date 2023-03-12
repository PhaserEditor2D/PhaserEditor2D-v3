/// <reference path="./SceneGameObjectSection.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class PrefabObjectVariableSection extends SceneGameObjectSection<ISceneGameObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.PrefabObjectVariableSection", "Variable", false);
        }

        getSectionHelpPath() {

            return "scene-editor/variable-properties.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            GameObjectVariableSection.createTypeEditor(this, comp);
        }

        canEdit(obj: any, n: number): boolean {

            return GameObjectEditorSupport.hasObjectComponent(obj, VariableComponent)
                && this.isPrefabSceneObject(obj);
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}