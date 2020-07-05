/// <reference path="../properties/UserPropertiesSection.ts" />

namespace phasereditor2d.scene.ui.editor.usercomponent {

    import controls = colibri.ui.controls;

    export class UserComponentPropertiesSection extends editor.properties.UserPropertiesSection {


        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.editor.usercomponent.ObjectScriptPropertiesSection", "Component Properties", false, false);

        }

        protected getSectionHelpPath(): string {
            // TODO: missing to write this documentation
            return "scene-editor/";
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

            const editor = this.getEditor();

            const before = UserComponentsEditorSnapshotOperation.takeSnapshot(editor);

            action(this.getUserProperties());
            editor.getViewer().repaint();

            const after = UserComponentsEditorSnapshotOperation.takeSnapshot(editor);

            editor.getUndoManager().add(new UserComponentsEditorSnapshotOperation(editor, before, after));
            editor.setDirty(true);

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