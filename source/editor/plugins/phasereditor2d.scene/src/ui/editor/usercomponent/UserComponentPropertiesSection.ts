/// <reference path="../properties/UserPropertiesSection.ts" />

namespace phasereditor2d.scene.ui.editor.usercomponent {

    import controls = colibri.ui.controls;

    export class UserComponentPropertiesSection extends editor.properties.UserPropertiesSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.editor.usercomponent.ObjectScriptPropertiesSection", "Arguments", false, false);
        }

        protected getSectionHelpPath(): string {
            // TODO: missing to write this documentation
            return "scene-editor/";
        }

        protected getUserProperties(): sceneobjects.UserProperties {

            return (this.getSelectionFirstElement() as UserComponent).getProperties();
        }

        protected runOperation(action: (props?: sceneobjects.UserProperties) => void, updateSelection?: boolean) {

            action(this.getUserProperties());

            if (updateSelection || true) {

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