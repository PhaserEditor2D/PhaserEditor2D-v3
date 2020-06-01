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

                const userProps = this.getScene().getUserProperties();

                userProps.add(userProps.createProperty(value));

                this.updateWithSelection();
            });

            btn.style.gridColumn = "1 / span 2";
            btn.style.justifySelf = "center";

            this.addUpdater(() => {

                this._propArea.innerHTML = "";

                const properties = this.getScene().getUserProperties().getProperties();

                for (const prop of properties) {

                    const info = prop.getInfo();

                    {
                        this.createLabel(this._propArea, "Name", "The property name. Like in 'speedMin'.");
                        const text = this.createText(this._propArea);
                        text.value = info.name;
                    }

                    {
                        this.createLabel(this._propArea, "Label", "The property display label. Like in 'Speed Min'.");
                        const text = this.createText(this._propArea);
                        text.value = info.label;
                    }

                    {
                        this.createLabel(this._propArea, "Tooltip", "The property tooltip.");
                        const text = this.createText(this._propArea);
                        text.value = info.tooltip;
                    }

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

                            const i = properties.indexOf(prop);
                            properties.splice(i, 1);
                            this.updateWithSelection();
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

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Scene && obj.getSettings().sceneType === core.json.SceneType.PREFAB;
        }
    }
}