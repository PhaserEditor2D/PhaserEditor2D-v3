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

        protected getUserProperties(): sceneobjects.UserProperties {

            return this.getProperty().getAllProperties();
        }

        protected getProperty(): sceneobjects.UserProperty {

            return this.getSelectionFirstElement();
        }

        protected componentTitleUpdated(): void {

            this.getEditor().refreshOutline();
        }

        private getEditor() {

            return colibri.ui.ide.Workbench.getWorkbench().getActiveEditor() as SceneEditor;
        }

        static runPropertiesOperation(editor: SceneEditor, action: (props?: sceneobjects.UserProperties) => void, updateSelection?: boolean) {

            const scene = editor.getScene();

            const before = ui.editor.properties.ChangePrefabPropertiesOperation.snapshot(editor);

            action(scene.getPrefabUserProperties());

            const after = ui.editor.properties.ChangePrefabPropertiesOperation.snapshot(editor);

            editor.getUndoManager()
                .add(new ChangePrefabPropertiesOperation(editor, before, after));

            editor.setDirty(true);

            editor.refreshOutline();

            if (updateSelection) {

                editor.getSelectionManager().refreshSelection();
            }
        }

        protected runOperation(action: (props?: sceneobjects.UserProperties) => void, updateSelection?: boolean) {

            PrefabPropertySection.runPropertiesOperation(this.getEditor(), action, updateSelection);
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof sceneobjects.UserProperty;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}