namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export declare type TUserPropertiesAction = (props?: sceneobjects.UserPropertiesManager) => void

    export abstract class UserPropertiesSection extends controls.properties.PropertySection<any> {

        private _propArea: HTMLDivElement;

        protected abstract getSectionHelpPath(): string;

        protected abstract getUserProperties(): sceneobjects.UserPropertiesManager;

        protected abstract runOperation(action: TUserPropertiesAction, updateSelection?: boolean);

        hasMenu() {

            return true;
        }

        createMenu(menu: controls.Menu) {

            ide.IDEPlugin.getInstance().createHelpMenuItem(menu, this.getSectionHelpPath());
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "1fr";

            this._propArea = this.createGridElement(comp, 2);
            comp.appendChild(this._propArea);

            const propTypes = ScenePlugin.getInstance().getUserPropertyTypes();

            const btn = this.createMenuButton(comp, "Add Property", () => propTypes.map(t => ({
                name: t.getName() + " Property",
                value: t.getId()
            })), (typeId: string) => {

                const newType = ScenePlugin.getInstance().getUserPropertyType(typeId);

                this.runOperation(userProps => {

                    const prop = userProps.createProperty(newType);
                    userProps.add(prop);
                    this.setExpandedStateInStorage(prop, true);
                }, true);
            });

            btn.style.gridColumn = "1 / span 2";
            btn.style.justifySelf = "center";

            this.addUpdater(() => {

                this._propArea.innerHTML = "";

                const properties = this.getUserProperties().getProperties();

                for (const prop of properties) {

                    const propPane = this.createGridElement(this._propArea, 2);
                    propPane.style.gridColumn = "1 / span 2";

                    const titleLabel = this.createTitlePanel(propPane, prop);

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

                    } else if (prop.getType().hasCustomPropertyType()) {

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

                                    this.setExpandedStateInStorage(prop, true);
                                }, true);
                            });

                        propPane.appendChild(propEditor.element);

                        propEditor.update();
                    }

                    {

                        const check = this.createCheckbox(propPane,
                            this.createLabel(propPane, "Custom Definition", "The compiler delegates the property's definition to the user."));

                        check.checked = prop.isCustomDefinition();

                        check.addEventListener("change", e => {

                            this.runOperation(() => {

                                prop.getInfo().customDefinition = check.checked;

                            }, false);
                        });
                    }
                }
            });
        }

        private setExpandedStateInStorage(prop: sceneobjects.UserProperty, value: boolean) {

            window.localStorage[`PrefabPropertiesSection[${prop.getName()}].expanded`] = value;
        }

        private getExpandedStateInStorage(prop: sceneobjects.UserProperty) {

            return window.localStorage[`PrefabPropertiesSection[${prop.getName()}].expanded`];
        }

        createTitlePanel(propPane: HTMLDivElement, prop: sceneobjects.UserProperty) {

            const titlePanel = document.createElement("div");
            titlePanel.classList.add("PropertySubTitlePanel");
            this._propArea.insertBefore(titlePanel, propPane);

            const collapsedIcon = colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_CONTROL_TREE_COLLAPSE);
            const expandedIcon = colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_CONTROL_TREE_EXPAND);

            const expanderControl = new controls.IconControl();

            titlePanel.appendChild(expanderControl.getCanvas());

            const titleLabel = this.createLabel(titlePanel, prop.getLabel());
            titleLabel.classList.add("PropertySubTitleLabel");

            const expanded = this.getExpandedStateInStorage(prop) === "true";
            propPane.style.display = expanded ? "grid" : "none";
            expanderControl.setIcon(expanded ? collapsedIcon : expandedIcon);

            const expandListener = () => {

                const expandIt = propPane.style.display === "none";

                propPane.style.display = expandIt ? "grid" : "none";

                this.setExpandedStateInStorage(prop, expandIt);

                expanderControl.setIcon(expandIt ? collapsedIcon : expandedIcon);
            };

            expanderControl.getCanvas().addEventListener("click", expandListener);
            titleLabel.addEventListener("click", expandListener);

            this.createPropertiesMenu(titlePanel, prop);

            return titleLabel;
        }

        private createPropertiesMenu(titlePanel: HTMLElement, prop: sceneobjects.UserProperty) {

            const icon = new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_SMALL_MENU));
            icon.getCanvas().classList.add("IconButton");
            titlePanel.appendChild(icon.getCanvas());
            icon.getCanvas().addEventListener("click", e => {

                const menu = new controls.Menu();

                menu.addAction({
                    text: "Move Up",
                    callback: () => {
                        this.runOperation(userProps => {

                            const list = userProps.getProperties();

                            const i = list.indexOf(prop);

                            if (i > 0) {

                                const temp = list[i - 1];
                                list[i - 1] = prop;
                                list[i] = temp;
                            }
                        }, true);
                    }
                });

                menu.addAction({
                    text: "Move Down",
                    callback: () => {
                        this.runOperation(userProps => {

                            const list = userProps.getProperties();

                            const i = list.indexOf(prop);

                            if (i < list.length - 1) {

                                const temp = list[i + 1];
                                list[i + 1] = prop;
                                list[i] = temp;
                            }
                        }, true);
                    }
                });

                menu.addSeparator();

                menu.addMenu(this.createMorphMenu(prop));

                menu.addSeparator();

                menu.addAction({
                    text: "Delete",
                    callback: () => {
                        this.runOperation(userProps => {

                            const list = userProps.getProperties();

                            const i = list.indexOf(prop);

                            list.splice(i, 1);
                        }, true);
                    }
                });
                menu.createWithEvent(e);
            });
        }

        private createMorphMenu(prop: sceneobjects.UserProperty) {

            const menu = new controls.Menu("Change Type");

            const propTypes = ScenePlugin.getInstance().getUserPropertyTypes();

            for (const propType of propTypes) {

                menu.addAction({
                    text: propType.getName(),
                    callback: () => {

                        this.runOperation(userProps => {

                            prop.getInfo().type = propType;

                        }, true);
                    }
                });
            }

            // const btn = this.createMenuButton(comp, "Add Property", propTypes.map(t => ({
            //     name: t.getName() + " Property",
            //     value: t.getId()
            // })), (typeId: string) => {

            //     const newType = ScenePlugin.getInstance().createUserPropertyType(typeId);

            //     this.runOperation(userProps => {

            //         const prop = userProps.createProperty(newType);
            //         userProps.add(prop);
            //         this.setExpandedStateInStorage(prop, true);
            //     }, true);
            // });

            return menu;
        }

        private createExpressionTypeField(parent: HTMLDivElement, prop: sceneobjects.UserProperty) {

            const type = prop.getType();

            this.createLabel(
                parent, "Expression Type", "The type of the expression. Like <code>'ICustomType'</code> or <code>'() => void'</code>.");

            const text = this.createText(parent);

            text.value = type.getExpressionType();

            text.addEventListener("change", e => {

                this.runOperation(() => {

                    type.setExpressionType(text.value);

                    this.setExpandedStateInStorage(prop, true);

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

                    this.setExpandedStateInStorage(prop, true);

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
    }
}