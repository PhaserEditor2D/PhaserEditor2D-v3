/// <reference path="../properties/UserPropertiesSection.ts" />
/// <reference path="../properties/SingleUserPropertySection.ts" />

namespace phasereditor2d.scene.ui.editor.usercomponent {

    import controls = colibri.ui.controls;

    export class UserComponentPropertySection extends editor.properties.SingleUserPropertySection<sceneobjects.UserProperty> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.editor.usercomponent.UserComponentPropertySection", "User Property", false, false);
        }

        protected getSectionHelpPath(): string {

            return "scene-editor/user-components-editor-edit-component.html";
        }

        getEditor() {

            return colibri.Platform.getWorkbench()
                .getActiveWindow().getEditorArea()
                .getSelectedEditor() as UserComponentsEditor;
        }

        protected getUserProperties(): sceneobjects.UserPropertiesManager {

            return this.getSelectionFirstElement().getManager();
        }

        protected getProperty(): sceneobjects.UserProperty {

            return this.getSelectionFirstElement();
        }

        protected componentTitleUpdated(): void {

            this.getEditor().refreshViewers();
        }

        runOperation(action: (props?: sceneobjects.UserPropertiesManager) => void, updateSelection?: boolean) {

            this.getEditor().runOperation(() => action(this.getUserProperties()));

            if (updateSelection) {

                this.updateWithSelection();
            }
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof sceneobjects.UserProperty;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}