namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class PrefabPropertiesSection extends SceneSection {

        private _sectionHelper: UserPropertiesSection;

        constructor(page: controls.properties.PropertyPage) {
            super(
                page, "phasereditor2d.scene.ui.editor.properties.PrefabPropertiesSection",
                "Prefab Properties", false, true);

            const self = this;

            class SectionHelper extends UserPropertiesSection {

                protected getSectionHelpPath(): string {

                    return self.getSectionHelpPath();
                }

                protected getUserProperties(): sceneobjects.UserProperties {

                    return self.getEditor().getScene().getPrefabUserProperties();
                }

                protected runOperation(action: (props?: sceneobjects.UserProperties) => void, updateSelection?: boolean) {

                    self.runOperation(action, updateSelection);
                }

                getSelection() {

                    return self.getSelection();
                }

                canEdit(obj: any, n: number): boolean {
                    throw new Error("Method not implemented.");
                }

                canEditNumber(n: number): boolean {
                    throw new Error("Method not implemented.");
                }
            }

            this._sectionHelper = new SectionHelper(page, "", "");
        }

        getSectionHelpPath() {
            return "scene-editor/prefab-user-properties.html";
        }

        createForm(parent: HTMLDivElement) {

            this._sectionHelper.createForm(parent);

            this.addUpdater(() => {

                if (this.getEditor().getScene()) {

                    this._sectionHelper.updateWithSelection();
                }
            });
        }

        runOperation(action: (props?: sceneobjects.UserProperties) => void, updateSelection = true) {

            const theEditor = this.getEditor();

            const before = editor.properties.ChangePrefabPropertiesOperation.snapshot(theEditor);

            action(this.getScene().getPrefabUserProperties());

            const after = editor.properties.ChangePrefabPropertiesOperation.snapshot(this.getEditor());

            this.getEditor().getUndoManager()
                .add(new ChangePrefabPropertiesOperation(this.getEditor(), before, after));

            theEditor.setDirty(true);

            if (updateSelection) {

                this.updateWithSelection();
            }
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Scene && obj.isPrefabSceneType();
        }
    }
}