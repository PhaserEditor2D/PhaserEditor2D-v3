/// <reference path="./SingleUserPropertySection.ts" />
namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class PrefabPropertySection extends SingleUserPropertySection<sceneobjects.UserProperty> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.editor.properties.PrefabPropertySection", "Prefab Property", false, false);
        }

        getSectionHelpPath() {

            return "scene-editor/prefab-user-properties.html";
        }

        protected getUserProperties(): sceneobjects.UserPropertiesManager {

            return this.getProperty().getManager();
        }

        protected getProperty(): sceneobjects.UserProperty {

            return this.getSelectionFirstElement();
        }

        protected componentTitleUpdated(): void {

            this.getEditor().refreshOutline();
            this.getEditor().updateInspectorViewSection(PrefabPropertiesSection.SECTION_ID);
        }

        private getEditor() {

            return colibri.ui.ide.Workbench.getWorkbench().getActiveEditor() as SceneEditor;
        }

        protected runOperation(action: (props?: sceneobjects.UserPropertiesManager) => void, updateSelection?: boolean) {

            ui.editor.properties.ChangePrefabPropertiesOperation.runPropertiesOperation(this.getEditor(), action, updateSelection);
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof sceneobjects.UserProperty;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}