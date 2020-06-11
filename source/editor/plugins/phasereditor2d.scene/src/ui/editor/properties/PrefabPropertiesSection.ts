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

            const propTypes = ScenePlugin.getInstance().createUserPropertyTypes();

            const btn = this.createMenuButton(comp, "Add Property", propTypes.map(t => ({
                name: t.getName() + " Property",
                value: t.getId()
            })), (typeId: string) => {

                const newType = ScenePlugin.getInstance().createUserPropertyType(typeId);

                this.runOperation(userProps => {

                    userProps.add(userProps.createProperty(newType));
                });
            });

            btn.style.gridColumn = "1 / span 2";
            btn.style.justifySelf = "center";

            this.addUpdater(() => {

                this._propArea.innerHTML = "";

                const properties = this.getScene().getPrefabUserProperties().getProperties();

                for (const prop of properties) {

                    const collapsedIcon = colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_CONTROL_TREE_COLLAPSE);
                    const expandedIcon = colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_CONTROL_TREE_EXPAND);

                    const expanderControl = new controls.IconControl();

                    this._propArea.appendChild(expanderControl.getCanvas());

                    const titleLabel = this.createLabel(this._propArea, prop.getLabel());
                    titleLabel.classList.add("PropertySubTitleLabel");

                    const propPane = this.createGridElement(this._propArea, 2);
                    propPane.style.gridColumn = "1 / span 2";

                    const expandStorageKey = `PrefabPropertiesSection[${prop.getName()}].expanded`;

                    const expanded = window.localStorage[expandStorageKey] === "true";
                    propPane.style.display = expanded ? "grid" : "none";
                    expanderControl.setIcon(expanded ? collapsedIcon : expandedIcon);

                    const expandListener = () => {

                        const expandIt = propPane.style.display === "none";

                        propPane.style.display = expandIt ? "grid" : "none";

                        window.localStorage[expandStorageKey] = expandIt;

                        expanderControl.setIcon(expandIt ? collapsedIcon : expandedIcon);
                    };

                    expanderControl.getCanvas().addEventListener("click", expandListener);
                    titleLabel.addEventListener("click", expandListener);

                    this._propArea.appendChild(propPane);

                    const info = prop.getInfo();

                    this.simpleField(propPane, info, "name", "Name", "The property name. Like in 'speedMin'.");

                    this.simpleField(
                        propPane, info, "label", "Label", "The property display label. Like in 'Speed Min'.", () => {

                            titleLabel.innerHTML = prop.getInfo().label;
                        });

                    this.simpleField(propPane, info, "tooltip", "Tooltip", "The property tooltip.");

                    {
                        this.createLabel(propPane, "Type", "The property type.");
                        const text = this.createText(propPane, true);
                        text.value = prop.getType().getName();
                    }

                    if (prop.getType() instanceof sceneobjects.OptionPropertyType) {

                        this.createOptionsField(propPane, prop);

                    } else if (prop.getType() instanceof sceneobjects.ExpressionPropertyType) {

                        this.createExpressionTypeField(propPane, prop);
                    }

                    {
                        this.createLabel(propPane, "Default", "The property default value.");

                        const propEditor = info.type.createEditorElement(
                            () => {
                                return prop.getInfo().defValue;
                            },
                            value => {

                                this.runOperation(() => {

                                    prop.getInfo().defValue = value;
                                });
                            });

                        propPane.appendChild(propEditor.element);

                        propEditor.update();
                    }

                    {
                        // tslint:disable-next-line:no-shadowed-variable
                        const btn = this.createButton(propPane, "Delete", e => {

                            this.runOperation(userProps => {

                                const i = userProps.getProperties().indexOf(prop);

                                properties.splice(i, 1);
                            });
                        });

                        btn.style.gridColumn = "1 / span 2";
                        btn.style.justifySelf = "right";
                    }
                }
            });
        }

        private createExpressionTypeField(parent: HTMLDivElement, prop: sceneobjects.UserProperty) {

            const type = prop.getType() as sceneobjects.ExpressionPropertyType;

            this.createLabel(
                parent, "Expression Type", "The type of the expression. Like <code>'ICustomType'</code> or <code>'() => void'</code>.");

            const text = this.createText(parent);

            text.value = type.getExpressionType();

            text.addEventListener("change", e => {

                this.runOperation(() => {

                    type.setExpressionType(text.value);

                }, true);
            });
        }

        private createOptionsField(parent: HTMLDivElement, prop: sceneobjects.UserProperty) {

            const type = prop.getType() as sceneobjects.OptionPropertyType;

            this.createLabel(
                parent, "Options", "An array of possible string values, like in <code>['good', 'bad', 'ugly']</code>.");

            const text = this.createTextArea(parent);

            text.value = JSON.stringify(type.getOptions());

            text.addEventListener("change", e => {

                this.runOperation(() => {

                    const array = JSON.parse(text.value);

                    if (Array.isArray(array)) {

                        const array2 = array.filter(v => typeof v === "string" || typeof v === "number")
                            .map(v => v.toString());

                        type.setOptions(array2);
                    }
                }, true);
            });
        }

        private simpleField(
            parent: HTMLDivElement, propInfo: any, infoProp: string, fieldLabel: string, fieldTooltip: string, updateCallback?: () => void) {

            this.createLabel(parent, fieldLabel, fieldTooltip);

            const text = this.createText(parent);
            text.value = propInfo[infoProp];

            text.addEventListener("change", e => {

                this.runOperation(() => {

                    propInfo[infoProp] = text.value;

                    if (updateCallback) {

                        updateCallback();
                    }

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