namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class PrefabPropertiesSection extends SceneSection {

        constructor(page: controls.properties.PropertyPage) {
            super(
                page, "phasereditor2d.scene.ui.editor.properties.PrefabPropertiesSection",
                "Prefab Properties", false, true);
        }

        getSectionHelpPath() {
            return "scene-editor/prefab-user-properties.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 1);

            const selector = (obj: sceneobjects.UserProperty) => {

                this.getEditor().setSelection([obj]);
            };

            SingleUserPropertySection.createAddComponentButton(comp, this, action => this.runOperation(action), selector);
        }

        runOperation(action: (props?: sceneobjects.UserProperties) => void, updateSelection = true) {

            PrefabPropertySection.runPropertiesOperation(this.getEditor(), action, updateSelection);
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Scene && obj.isPrefabSceneType() || obj instanceof sceneobjects.PrefabUserProperties;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}