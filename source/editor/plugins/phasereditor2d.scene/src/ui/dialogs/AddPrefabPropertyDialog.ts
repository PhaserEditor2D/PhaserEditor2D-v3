/// <reference path="./AbstractAddPrefabPropertyDialog.ts" />

namespace phasereditor2d.scene.ui.dialogs {

    export class AddPrefabPropertyDialog extends AbstractAddPrefabPropertyDialog {

        protected override addProperty(propType: sceneobjects.UserPropertyType<any>) {

            const editor = colibri.Platform.getWorkbench().getActiveEditor() as ui.editor.SceneEditor;

            ui.editor.properties.ChangePrefabPropertiesOperation.runPropertiesOperation(editor, (props) => {

                const prop = props.createProperty(propType);

                props.add(prop);

                editor.setSelection([prop]);
            });
        }
    }
}