namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class PrefabPropertiesSection extends SceneSection {

        static SECTION_ID = "phasereditor2d.scene.ui.editor.properties.PrefabPropertiesSection";

        constructor(page: controls.properties.PropertyPage) {
            super(
                page, PrefabPropertiesSection.SECTION_ID,
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

            const linksComp = this.createGridElement(comp, 1);

            comp.appendChild(linksComp);

            this.addUpdater(() => {

                linksComp.innerHTML = "";

                const prefabProps = this.getScene().getPrefabUserProperties();

                const props = prefabProps.getProperties();

                for (const prop of props) {

                    const link = document.createElement("a");
                    link.href = "#";
                    link.textContent = prop.getLabel();
                    link.addEventListener("click", () => {

                        this.getEditor().setSelection([prop]);
                    });

                    linksComp.appendChild(link);

                    controls.Tooltip.tooltip(link, prop.getName() + ": " + prop.getType().getName());
                }
            });

            SingleUserPropertySection.createAddPropertyButton(comp, this, action => this.runOperation(action), selector);
        }

        runOperation(action: (props?: sceneobjects.UserPropertiesManager) => void, updateSelection = true) {

            ui.editor.properties.ChangePrefabPropertiesOperation.runPropertiesOperation(this.getEditor(), action, updateSelection);
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Scene && obj.isPrefabSceneType()
                || obj instanceof sceneobjects.PrefabUserProperties
                || obj instanceof sceneobjects.UserProperty;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}