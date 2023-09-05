namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export abstract class SingleUserPropertySection<T extends any> extends controls.properties.PropertySection<T> {
        private _propArea: HTMLDivElement;

        protected abstract getSectionHelpPath(): string;

        protected abstract getUserProperties(): sceneobjects.UserPropertiesManager;

        protected abstract getProperty(): sceneobjects.UserProperty;

        protected abstract componentTitleUpdated(): void;

        protected abstract runOperation(action: (props?: sceneobjects.UserPropertiesManager) => void, updateSelection?: boolean);

        static createAddPropertyButton(
            comp: HTMLDivElement,
            formBuilder: colibri.ui.controls.properties.FormBuilder,
            runOperation: (
                action: TUserPropertiesAction) => void,
            selector: (obj: any) => void) {

            const propTypes = ScenePlugin.getInstance().getUserPropertyTypes();

            const buttonElement = formBuilder.createButton(comp, "Add Property", () => {

                class Dlg extends ui.dialogs.AbstractAddPrefabPropertyDialog {

                    protected addProperty(propType: sceneobjects.UserPropertyType<any>): void {

                        runOperation(userProps => {

                            const prop = userProps.createProperty(propType);
                            userProps.add(prop);

                            selector(prop);
                        });
                    }
                }

                const dlg = new Dlg();
                dlg.create();
            });

            return { buttonElement };
        }

        hasMenu() {

            return true;
        }

        createMenu(menu: controls.Menu) {

            const prop = this.getProperty();

            menu.addMenu(this.createMorphMenu(prop));

            menu.addAction({
                text: "Delete",
                callback: () => {
                    this.runOperation(userProps => {

                        userProps.deleteProperty(prop.getName());

                    }, true);
                }
            });

            menu.addSeparator();

            ide.IDEPlugin.getInstance().createHelpMenuItem(menu, this.getSectionHelpPath());
        }

        createForm(parent: HTMLDivElement) {

            const comp1 = this.createGridElement(parent);
            comp1.style.gridTemplateColumns = "1fr";

            this._propArea = this.createGridElement(comp1, 2);
            comp1.appendChild(this._propArea);

            this.addUpdater(() => {

                this._propArea.innerHTML = "";

                const prop = this.getProperty();

                const info = prop.getInfo();

                this.simpleField(this._propArea, info, "name", "Name", "The property name. Like in 'speedMin'.");

                this.simpleField(
                    this._propArea, info, "label", "Label", "The property display label. Like in 'Speed Min'.", () => {

                        this.componentTitleUpdated();
                    });

                this.simpleField(this._propArea, info, "tooltip", "Tooltip", "The property tooltip.");

                {
                    this.createLabel(this._propArea, "Type", "The property type.");
                    const text = this.createText(this._propArea, true);
                    text.value = prop.getType().getName();
                }

                if (prop.getType() instanceof sceneobjects.OptionPropertyType) {

                    this.createOptionsField(this._propArea, prop);

                } else if (prop.getType().hasCustomPropertyType()) {

                    this.createExpressionTypeField(this._propArea, prop);
                }

                {
                    this.createLabel(this._propArea, "Default", "The property default value.");

                    const propEditor = info.type.createEditorElement(
                        () => {
                            return prop.getInfo().defValue;
                        },
                        value => {

                            this.runOperation(() => {

                                prop.getInfo().defValue = value;

                            }, true);
                        });

                    this._propArea.appendChild(propEditor.element);

                    propEditor.update();
                }

                {

                    const check = this.createCheckbox(this._propArea,
                        this.createLabel(this._propArea, "Custom Definition", "The compiler delegates the property's definition to the user."));

                    check.checked = prop.isCustomDefinition();

                    check.addEventListener("change", e => {

                        this.runOperation(() => {

                            prop.getInfo().customDefinition = check.checked;

                        }, false);
                    });
                }
            }); // updater;
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
    }
}