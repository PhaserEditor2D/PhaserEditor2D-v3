namespace phasereditor2d.scene.ui.editor.properties {

    import io = colibri.core.io;
    import controls = colibri.ui.controls;

    export class PrefabPropertiesSection extends SceneSection {

        private _propArea: HTMLDivElement;

        constructor(page: controls.properties.PropertyPage) {
            super(
                page, "phasereditor2d.scene.ui.editor.properties.PrefabPropertiesSection",
                "Prefab Properties", false, true);
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);

            comp.style.gridTemplateColumns = "1fr";

            this._propArea = this.createGridElement(comp, 2);
            comp.appendChild(this._propArea);

            const propTypes = ScenePlugin.getInstance().getUserPropertyTypes();

            const btn = this.createMenuButton(comp, "Add Property", propTypes.map(t => ({
                name: t.getName() + " Property",
                value: t
            })), value => {

                this.runOperation(userProps => {

                    userProps.add(userProps.createProperty(value));
                });
            });

            btn.style.gridColumn = "1 / span 2";
            btn.style.justifySelf = "center";

            this.addUpdater(() => {

                this._propArea.innerHTML = "";

                const properties = this.getScene().getPrefabUserProperties().getProperties();

                for (const prop of properties) {

                    const info = prop.getInfo();

                    this.simpleField(info, "name", "Name", "The property name. Like in 'speedMin'.");

                    this.simpleField(info, "label", "Label", "The property display label. Like in 'Speed Min'.");

                    this.simpleField(info, "tooltip", "Tooltip", "The property tooltip.");

                    {
                        this.createLabel(this._propArea, "Type", "The property type.");
                        const text = this.createText(this._propArea, true);
                        text.value = prop.getType().getName();
                    }

                    {
                        this.createLabel(this._propArea, "Default", "The property default value.");
                        const text = this.createText(this._propArea);
                        text.value = info.type.renderValue(info.defValue);
                    }

                    {
                        // tslint:disable-next-line:no-shadowed-variable
                        const btn = this.createButton(this._propArea, "Delete", e => {

                            this.runOperation(userProps => {

                                const i = userProps.getProperties().indexOf(prop);

                                properties.splice(i, 1);
                            });
                        });

                        btn.style.gridColumn = "1 / span 2";
                        btn.style.justifySelf = "right";
                    }

                    {
                        const sep = document.createElement("hr");
                        sep.style.width = "100%";
                        sep.style.gridColumn = "1 / span 2";
                        sep.style.opacity = "0.5";
                        this._propArea.appendChild(sep);
                    }
                }
            });
        }

        private simpleField(propInfo: any, infoProp: string, fieldLabel: string, fieldTooltip: string) {

            this.createLabel(this._propArea, fieldLabel, fieldTooltip);

            const text = this.createText(this._propArea);
            text.value = propInfo[infoProp];

            text.addEventListener("change", e => {

                this.runOperation(() => {

                    propInfo[infoProp] = text.value;

                }, false);
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

            return obj instanceof Scene && obj.getSettings().sceneType === core.json.SceneType.PREFAB;
        }
    }
}