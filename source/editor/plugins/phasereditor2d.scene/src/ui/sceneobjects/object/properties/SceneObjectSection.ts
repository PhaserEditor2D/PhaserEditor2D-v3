namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    /**
     * A base for objects added to the scene.
     * It doesn't need to be a game object (like an Image), it could be a plain object.
     * You can take a look to the `SceneGameObjectSection` and the `PlainObjectSection`.
     */
    export abstract class SceneObjectSection<T extends ISceneObject> extends editor.properties.BaseSceneSection<T> {

        createEnumField<TValue>(
            parent: HTMLElement, property: IEnumProperty<T, TValue>, checkUnlocked = true, filter?: (v: TValue) => boolean) {

            const getItems = () => (property.values ?? property.getEnumValues(this.getSelection()[0]))
                .filter(v => !filter || filter(v))
                .map(value => {
                    return {
                        name: property.getValueLabel(value),
                        value
                    };
                });

            const btn = this.createMenuButton(parent, "", getItems, value => {

                this.getEditor().getUndoManager().add(
                    new SimpleOperation(this.getEditor(), this.getSelection(), property, value));
            });

            this.addUpdater(() => {

                btn.disabled = checkUnlocked && !this.isUnlocked(property);

                btn.textContent = this.flatValues_StringJoinDifferent(

                    this.getSelection()

                        .map(obj => property.getValueLabel(property.getValue(obj)))
                );
            });

            return btn;
        }

        createIncrementableStringField(parent: HTMLElement, property: IProperty<T>) {

            const text = this.createIncrementableText(
                parent, false, property.increment, property.incrementMin, property.incrementMax, property.incrementValueComputer);

            const makeListener = (isPreview: boolean) => {

                return (e: Event | CustomEvent) => {

                    const textValue = text.value;

                    let value: string;

                    if (textValue.trim() === "") {

                        value = property.defValue;

                    } else {

                        value = textValue
                    }

                    if (isPreview) {

                        for (const obj of this.getSelection()) {

                            property.setValue(obj, value);
                        }

                        this.getEditor().repaint();

                    } else {

                        if (e instanceof CustomEvent) {

                            // this is a custom event then it is setting the value
                            // from alternative methods like mouse wheel or dragging the label
                            // so let's restore the initial value of the objects

                            if (e.detail) {

                                const initValue = e.detail.initText as string;

                                for (const obj of this.getSelection()) {

                                    property.setValue(obj, initValue);
                                }
                            }
                        }

                        this.getEditor().getUndoManager().add(
                            new SimpleOperation(this.getEditor(), this.getSelection(), property, value));
                    }
                }
            }

            text.addEventListener("preview", makeListener(true));

            text.addEventListener("change", makeListener(false));

            this.addUpdater(() => {

                text.disabled = !this.isUnlocked(property);

                const values = this.getSelection()

                    .map(obj => property.getValue(obj));

                text.value = this.flatValues_StringOneOrNothing(values);
            });

            return text;
        }

        // tslint:disable-next-line:ban-types
        createFloatField(parent: HTMLElement, property: IProperty<T>) {

            const text = this.createIncrementableText(
                parent, false, property.increment, property.incrementMin, property.incrementMax);

            const makeListener = (isPreview: boolean) => {

                return (e: Event | CustomEvent) => {

                    const textValue = text.value;

                    let value: number;

                    if (textValue.trim() === "") {

                        value = property.defValue;

                    } else {

                        value = this.parseNumberExpression(text);
                    }

                    if (isNaN(value)) {

                        this.updateWithSelection();

                    } else {

                        if (isPreview) {

                            for (const obj of this.getSelection()) {

                                property.setValue(obj, value);
                            }

                            this.getEditor().repaint();

                        } else {

                            if (e instanceof CustomEvent) {

                                // this is a custom event then it is setting the value
                                // from alternative methods like mouse wheel or dragging the label
                                // so let's restore the initial value of the objects

                                if (e.detail) {

                                    const initText = e.detail.initText as string;

                                    const value = this.parseNumberExpressionString(initText);

                                    if (typeof value === "number") {

                                        for (const obj of this.getSelection()) {

                                            property.setValue(obj, value);
                                        }
                                    }
                                }
                            }

                            this.getEditor().getUndoManager().add(
                                new SimpleOperation(this.getEditor(), this.getSelection(), property, value));
                        }
                    }
                }
            }

            text.addEventListener("preview", makeListener(true));

            text.addEventListener("change", makeListener(false));

            this.addUpdater(() => {

                text.disabled = !this.isUnlocked(property);

                const values = this.getSelection()

                    .map(obj => property.getValue(obj));

                text.value = this.flatValues_Number(values);
            });

            return text;
        }

        createStringField(
            parent: HTMLElement, property: IProperty<T>,
            checkUnlock = true, readOnlyOnMultiple = false, multiLine = false, forceReadOnly = false) {

            const text = multiLine ? this.createTextArea(parent, false) : this.createText(parent, false);

            text.addEventListener("change", e => {

                const value = text.value;

                this.getEditor().getUndoManager().add(
                    new SimpleOperation(this.getEditor(), this.getSelection(), property, value));
            });

            this.addUpdater(() => {

                text.readOnly = forceReadOnly || checkUnlock && !this.isUnlocked(property);

                if (readOnlyOnMultiple) {

                    text.readOnly = text.readOnly || readOnlyOnMultiple && this.getSelection().length > 1;
                }

                text.value = this.flatValues_StringOneOrNothing(

                    this.getSelection()

                        .map(obj => property.getValue(obj))
                );
            });

            return text;
        }

        createStringDialogField(
            parent: HTMLElement, property: IProperty<T>,
            checkUnlock = true, readOnlyOnMultiple = false) {

            const { text, btn } = this.createTextDialog(parent, property.label, false);

            text.addEventListener("change", e => {

                const value = text.value;

                this.getEditor().getUndoManager().add(
                    new SimpleOperation(this.getEditor(), this.getSelection(), property, value));
            });

            this.addUpdater(() => {

                text.readOnly = checkUnlock && !this.isUnlocked(property);

                if (readOnlyOnMultiple) {

                    text.readOnly = text.readOnly || readOnlyOnMultiple && this.getSelection().length > 1;
                }

                text.value = this.flatValues_StringOneOrNothing(

                    this.getSelection()

                        .map(obj => property.getValue(obj))
                );

                btn.disabled = text.readOnly;
            });

            return text;
        }

        createColorField(
            parent: HTMLElement, property: IProperty<T>, allowAlpha = true,
            checkUnlock = true, readOnlyOnMultiple = false) {

            const colorElement = this.createColor(parent, false, allowAlpha);
            const text = colorElement.text;
            const btn = colorElement.btn;

            const currentColor = text.value;

            text.addEventListener("preview", e => {

                const value = text.value;

                console.log("preview color", value);

                for (const obj of this.getSelection()) {

                    property.setValue(obj, value);
                }

                this.getEditor().repaint();
            });

            text.addEventListener("change", e => {

                const value = text.value;

                this.getEditor().getUndoManager().add(
                    new SimpleOperation(this.getEditor(), this.getSelection(), property, value));
            });

            this.addUpdater(() => {

                text.readOnly = checkUnlock && !this.isUnlocked(property);

                if (readOnlyOnMultiple) {

                    text.readOnly = text.readOnly || readOnlyOnMultiple && this.getSelection().length > 1;
                }

                btn.disabled = text.readOnly;

                text.value = this.flatValues_StringOneOrNothing(

                    this.getSelection()

                        .map(obj => property.getValue(obj))
                );

                btn.style.background = text.value.endsWith("selected)") ? "transparent" : text.value;
            });

            return colorElement;
        }

        createKeyCodeField(parent: HTMLElement, property: IProperty<T>, checkUnlock = true) {

            const btn = this.createButton(parent, "KeyCode", e => {

                const viewer = new KeyboardKeysViewer();

                const selObj = this.getSelectionFirstElement();
                const keyCode = property.getValue(selObj);

                viewer.revealAndSelect(keyCode);

                const dlg = new controls.dialogs.ViewerDialog(viewer, false);

                dlg.create();

                dlg.setTitle("Select Key Code");

                dlg.addOpenButton("Select", (sel) => {

                    const value = sel[0];
                    const keys = this.getSelection();

                    this.getEditor().getUndoManager().add(
                        new SimpleOperation(this.getEditor(), keys, property, value));

                }, false);

                dlg.addCancelButton();
            });

            this.addUpdater(() => {

                btn.textContent = this.flatValues_StringOneOrNothing(
                    this.getSelection().map(obj => property.getValue(obj)));

                btn.disabled = checkUnlock && !this.isUnlocked(property);
            });
        }

        createBooleanField(parent: HTMLElement, property: IProperty<T>, checkUnlock = true) {

            const labelElement = this.createLabel(parent, property.label, PhaserHelp(property.tooltip));

            const checkElement = this.createCheckbox(parent, labelElement);

            checkElement.addEventListener("change", e => {

                const value = checkElement.checked;

                this.getEditor().getUndoManager().add(
                    new SimpleOperation(this.getEditor(), this.getSelection(), property, value));
            });

            this.addUpdater(() => {

                checkElement.disabled = checkUnlock && !this.isUnlocked(property);

                const list = this.getSelection()

                    .map(obj => property.getValue(obj) as boolean)

                    .filter(b => !b);

                checkElement.checked = list.length === 0;
            });

            return {
                labelElement,
                checkElement
            };
        }

        createObjectVarField(
            parent: HTMLElement, property: IProperty<T>,
            checkUnlock = true, readOnlyOnMultiple = false) {

            const fieldElement = document.createElement("div");
            fieldElement.classList.add("formGrid");
            fieldElement.style.gridTemplateColumns = "1fr auto";

            parent.appendChild(fieldElement);

            const text = this.createText(fieldElement, false);

            const getValue = () => this.flatValues_StringOneOrNothing(

                this.getSelection()

                    .map(obj => property.getValue(obj))
            );

            text.addEventListener("change", e => {

                const value = text.value;

                this.getEditor().getUndoManager().add(
                    new SimpleOperation(this.getEditor(), this.getSelection(), property, value));
            });

            this.addUpdater(() => {

                text.readOnly = checkUnlock && !this.isUnlocked(property);

                if (readOnlyOnMultiple) {

                    text.readOnly = text.readOnly || readOnlyOnMultiple && this.getSelection().length > 1;
                }

                text.value = getValue();
            });

            const dlgArgs: controls.properties.ICreateButtonDialogArgs = {
                getValue: () => getValue(),
                createDialogViewer: async (revealValue) => {

                    const sceneEditor = this.getEditor();

                    const viewer = new controls.viewers.TreeViewer("phasereditor2d.scene.editor.ObjectVarExpressionType.Dialog");
                    viewer.setCellRendererProvider(new editor.outline.SceneEditorOutlineRendererProvider());
                    viewer.setLabelProvider(new editor.outline.SceneEditorOutlineLabelProvider());
                    viewer.setStyledLabelProvider(new editor.outline.SceneEditorOutlineStyledLabelProvider());
                    viewer.setContentProvider(new ObjectVarContentProvider(sceneEditor));

                    const scene = sceneEditor.getScene();

                    const input = [
                        ...scene.getGameObjects(),
                        ...scene.getObjectLists().getLists()
                    ];

                    viewer.setInput(input);

                    const found = scene.findByEditorLabel(revealValue);

                    if (found) {

                        viewer.setSelection([found]);
                        viewer.reveal(found);
                    }

                    return viewer;
                },
                dialogElementToString: (viewer, value) => {

                    const support = EditorSupport.getEditorSupport(value);

                    if (support) {

                        return support.getLabel();
                    }

                    return viewer.getLabelProvider().getLabel(value);
                },
                dialogTittle: "Select Object",
                onValueSelected: (value: string) => {

                    text.value = value;

                    this.getEditor().getUndoManager().add(
                        new SimpleOperation(this.getEditor(), this.getSelection(), property, value));
                },
                updateIconCallback: async (iconControl, value) => {

                    const scene = this.getEditor().getScene();

                    const found = scene.findByEditorLabel(value);

                    if (found) {

                        const renderer = new editor.outline.SceneEditorOutlineRendererProvider()
                            .getCellRenderer(found);

                        const icon = new controls.viewers.ImageFromCellRenderer(found, renderer, controls.RENDER_ICON_SIZE, controls.RENDER_ICON_SIZE)

                        await icon.preload();

                        iconControl.setIcon(icon);

                    } else {

                        iconControl.setIcon(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));
                    }
                },
            };

            const result = this.createButtonDialog(dlgArgs);

            fieldElement.appendChild(result.buttonElement);

            this.addUpdater(() => {

                result.updateDialogButtonIcon();
            });

            return {
                textElement: text,
                btnElement: result.buttonElement
            };
        }

        isUnlocked(...properties: Array<IProperty<T>>) {

            for (const obj of this.getSelection()) {

                for (const property of properties) {

                    const objES = obj.getEditorSupport();

                    const locked = !objES.isUnlockedProperty(property);

                    if (locked) {

                        return false;
                    }
                }
            }

            return true;
        }
    }
}