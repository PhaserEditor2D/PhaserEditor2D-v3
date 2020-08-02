/// <reference path="../properties/UserPropertiesSection.ts" />

namespace phasereditor2d.scene.ui.editor.usercomponent {

    import controls = colibri.ui.controls;

    export class UserComponentPropertiesSection extends editor.properties.UserPropertiesSection {


        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.editor.usercomponent.UserComponentPropertiesSection", "Component Properties", false, false);

        }

        protected getSectionHelpPath(): string {

            return "scene-editor/user-components-editor-edit-component.html";
        }

        protected getUserProperties(): sceneobjects.UserProperties {

            return (this.getSelectionFirstElement() as UserComponent).getUserProperties();
        }

        getEditor() {

            return colibri.Platform.getWorkbench()
                .getActiveWindow().getEditorArea()
                .getSelectedEditor() as UserComponentsEditor;
        }

        runOperation(action: (props?: sceneobjects.UserProperties) => void, updateSelection?: boolean) {

            this.getEditor().runOperation(() => action(this.getUserProperties()));

            if (updateSelection) {

                this.updateWithSelection();
            }
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof UserComponent;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}