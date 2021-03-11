namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export abstract class SceneGameObjectSection<T extends ISceneGameObjectLike> extends editor.properties.BaseSceneSection<T> {

        createMenu(menu: controls.Menu) {

            super.createMenu(menu);

            this.createTabSectionMenuItem(menu, editor.properties.TAB_SECTION_DETAILS);
        }

        isPrefabSceneObject(obj: any) {

            const support = GameObjectEditorSupport.getEditorSupport(obj);

            if (support) {

                const scene = support.getScene();

                if (scene.isPrefabSceneType()) {

                    if (scene.getPrefabObject() === obj) {

                        return true;
                    }
                }
            }

            return false;
        }

        createGridElementWithPropertiesXY(parent: HTMLElement) {

            const comp = this.createGridElement(parent);

            comp.style.gridTemplateColumns = "auto auto auto 1fr auto 1fr";

            return comp;
        }

        createGridElementWithPropertiesBoolXY(parent: HTMLElement) {

            const comp = this.createGridElement(parent);

            comp.style.gridTemplateColumns = "auto auto auto 1fr auto 1fr";

            return comp;
        }

        createLock(parent: HTMLElement, ...properties: Array<IProperty<T>>) {

            const mutableIcon = new controls.IconControl();

            const element = mutableIcon.getCanvas();
            element.classList.add("PropertyLockIcon");
            parent.appendChild(element);

            const lockedIcon = ScenePlugin.getInstance().getIcon(ICON_LOCKED);
            const unlockedIcon = ScenePlugin.getInstance().getIcon(ICON_UNLOCKED);

            element.addEventListener("click", e => {

                const unlocked = !this.isUnlocked(...properties);

                this.getEditor().getUndoManager().add(
                    new PropertyUnlockOperation(this.getEditor(), this.getSelection(), properties, unlocked));
            });

            this.addUpdater(() => {

                const thereIsPrefabInstances = this.getSelection()

                    .map(obj => obj.getEditorSupport().isPrefabInstance())

                    .find(b => b);

                if (thereIsPrefabInstances) {

                    element.style.width = controls.RENDER_ICON_SIZE + "px";

                    const unlocked = this.isUnlocked(...properties);

                    mutableIcon.setIcon(unlocked ? unlockedIcon : lockedIcon);

                } else {

                    element.style.width = "0px";
                }
            });
        }

        isUnlocked(...properties: Array<IProperty<T>>) {

            for (const obj of this.getSelection()) {

                for (const property of properties) {

                    const locked = !obj.getEditorSupport().isUnlockedProperty(property);

                    if (locked) {

                        return false;
                    }
                }
            }

            return true;
        }

        createNumberPropertyRow(parent: HTMLElement, prop: IProperty<any>, fullWidth = true) {

            this.createLock(parent, prop);

            this.createLabel(parent, prop.label, PhaserHelp(prop.tooltip))
                .style.gridColumn = "2/ span 2";

            this.createFloatField(parent, prop)
                .style.gridColumn = fullWidth ? "4 / span 3" : "4";
        }

        createNumberProperty(parent: HTMLElement, prop: IProperty<any>) {

            this.createLock(parent, prop);

            this.createLabel(parent, prop.label, PhaserHelp(prop.tooltip));

            this.createFloatField(parent, prop);
        }

        createPropertyBoolean(parent: HTMLElement, prop: IProperty<any>, lockIcon = true) {

            if (lockIcon) {

                this.createLock(parent, prop);
            }

            const elements = this.createBooleanField(parent, prop);
            elements.labelElement.style.gridColumn = "2 / auto";

            return elements;
        }

        createPropertyBoolXYRow(parent: HTMLElement, propXY: IPropertyXY, lockIcon: boolean = true) {

            if (lockIcon) {

                this.createLock(parent, propXY.x, propXY.y);
                this.createLabel(parent, propXY.label, PhaserHelp(propXY.tooltip));

            } else {

                const label = this.createLabel(parent, propXY.label, PhaserHelp(propXY.tooltip));
                label.style.gridColumn = "2";
            }

            for (const prop of [propXY.x, propXY.y]) {

                this.createBooleanField(parent, prop);
            }
        }

        createPropertyFloatRow(parent: HTMLElement, prop: IProperty<any>, lockIcon: boolean = true) {

            if (lockIcon) {

                this.createLock(parent, prop);
            }

            const label = this.createLabel(parent, prop.label, PhaserHelp(prop.tooltip));
            label.style.gridColumn = "2";

            const text = this.createFloatField(parent, prop);

            return text;
        }

        createPropertyStringRow(parent: HTMLElement, prop: IProperty<any>, lockIcon: boolean = true) {

            if (lockIcon) {

                this.createLock(parent, prop);
            }

            const label = this.createLabel(parent, prop.label, PhaserHelp(prop.tooltip));
            label.style.gridColumn = "2";

            const text = this.createStringField(parent, prop);

            return text;
        }

        createPropertyStringDialogRow(parent: HTMLElement, prop: IProperty<any>, lockIcon: boolean = true) {

            if (lockIcon) {

                this.createLock(parent, prop);
            }

            const label = this.createLabel(parent, prop.label, PhaserHelp(prop.tooltip));
            label.style.gridColumn = "2";

            return this.createStringDialogField(parent, prop);
        }

        createPropertyColorRow(parent: HTMLElement, prop: IProperty<any>, allowAlpha = true, lockIcon: boolean = true) {

            if (lockIcon) {

                this.createLock(parent, prop);
            }

            const label = this.createLabel(parent, prop.label, PhaserHelp(prop.tooltip));
            label.style.gridColumn = "2";

            const text = this.createColorField(parent, prop, allowAlpha);

            return text;
        }

        createPropertyEnumRow(parent: HTMLElement, prop: IEnumProperty<any, any>, lockIcon: boolean = true) {

            if (lockIcon) {

                this.createLock(parent, prop);
            }

            const label = this.createLabel(parent, prop.label, PhaserHelp(prop.tooltip));
            label.style.gridColumn = "2";

            const btn = this.createEnumField(parent, prop);

            return btn;
        }

        createPropertyXYRow(parent: HTMLElement, propXY: IPropertyXY, lockIcon: boolean = true) {

            if (lockIcon) {

                this.createLock(parent, propXY.x, propXY.y);
                this.createLabel(parent, propXY.label, PhaserHelp(propXY.tooltip));

            } else {

                const label = this.createLabel(parent, propXY.label, PhaserHelp(propXY.tooltip));
                label.style.gridColumn = "2";
            }

            for (const prop of [propXY.x, propXY.y]) {

                this.createLabel(parent, prop.label, PhaserHelp(prop.tooltip));
                this.createFloatField(parent, prop);
            }
        }

        createEnumField<TValue>(
            parent: HTMLElement, property: IEnumProperty<T, TValue>, checkUnlocked = true) {

            const items = property.values
                .map(value => {
                    return {
                        name: property.getValueLabel(value),
                        value
                    };
                });

            const btn = this.createMenuButton(parent, "", items, value => {

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

        // tslint:disable-next-line:ban-types
        createFloatField(parent: HTMLElement, property: IProperty<T>) {

            const text = this.createText(parent, false);

            text.addEventListener("change", e => {

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

                    this.getEditor().getUndoManager().add(
                        new SimpleOperation(this.getEditor(), this.getSelection(), property, value));
                }
            });

            this.addUpdater(() => {

                text.readOnly = !this.isUnlocked(property);

                text.value = this.flatValues_Number(

                    this.getSelection()

                        .map(obj => property.getValue(obj))
                );
            });

            return text;
        }

        createStringField(
            parent: HTMLElement, property: IProperty<T>,
            checkUnlock = true, readOnlyOnMultiple = false, multiLine = false) {

            const text = multiLine ? this.createTextArea(parent, false) : this.createText(parent, false);

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

    }
}