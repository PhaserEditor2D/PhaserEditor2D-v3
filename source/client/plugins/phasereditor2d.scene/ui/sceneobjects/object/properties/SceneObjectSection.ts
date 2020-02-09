namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export abstract class SceneObjectSection<T extends ISceneObjectLike> extends editor.properties.BaseSceneSection<T> {

        protected createGridElementWithPropertiesXY(parent: HTMLElement) {

            const comp = this.createGridElement(parent);

            comp.style.gridTemplateColumns = "auto auto auto 1fr auto 1fr";

            return comp;
        }


        protected createGridElementWithPropertiesBoolXY(parent: HTMLElement) {

            const comp = this.createGridElement(parent);

            comp.style.gridTemplateColumns = "auto auto auto 1fr auto 1fr";

            return comp;
        }

        protected createLock(parent: HTMLElement, ...properties: Array<IProperty<T>>) {

            const mutableIcon = new controls.MutableIcon();

            const element = mutableIcon.getElement();
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

                    element.style.width = controls.ICON_SIZE + "px";

                    const unlocked = this.isUnlocked(...properties);

                    mutableIcon.setIcon(unlocked ? unlockedIcon : lockedIcon);

                    mutableIcon.repaint();

                } else {

                    element.style.width = "0px";
                }
            });
        }

        protected isUnlocked(...properties: Array<IProperty<T>>) {

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

        protected createNumberPropertyRow(parent: HTMLElement, prop: IProperty<any>, fullWidth = true) {

            this.createLock(parent, prop);

            this.createLabel(parent, prop.label)
                .style.gridColumn = "2/ span 2";

            this.createFloatField(parent, prop)
                .style.gridColumn = fullWidth ? "4 / span 3" : "4";
        }

        protected createPropertyBoolXYRow(parent: HTMLElement, propXY: IPropertyXY, lockIcon: boolean = true) {

            if (lockIcon) {

                this.createLock(parent, propXY.x, propXY.y);

            } else {

                const label = this.createLabel(parent, propXY.label);
                label.style.gridColumn = "2";
            }

            for (const prop of [propXY.x, propXY.y]) {

                this.createLabel(parent, prop.label);
                this.createBooleanField(parent, prop);
            }
        }

        protected createPropertyXYRow(parent: HTMLElement, propXY: IPropertyXY, lockIcon: boolean = true) {

            if (lockIcon) {

                this.createLock(parent, propXY.x, propXY.y);
                this.createLabel(parent, propXY.label);

            } else {

                const label = this.createLabel(parent, propXY.label);
                label.style.gridColumn = "2";
            }

            for (const prop of [propXY.x, propXY.y]) {

                this.createLabel(parent, prop.label);
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

                btn.textContent = this.flatValues_StringOneOrNothing(

                    this.getSelection()

                        .map(obj => property.getValueLabel(property.getValue(obj)))
                );
            });
        }

        // tslint:disable-next-line:ban-types
        createFloatField(parent: HTMLElement, property: IProperty<T>) {

            const text = this.createText(parent, false);

            text.addEventListener("change", e => {

                const value = Number.parseFloat(text.value);

                this.getEditor().getUndoManager().add(
                    new SimpleOperation(this.getEditor(), this.getSelection(), property, value));
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

        createStringField(parent: HTMLElement, property: IProperty<T>, checkUnlock = true) {

            const text = this.createText(parent, false);

            text.addEventListener("change", e => {

                const value = text.value;

                this.getEditor().getUndoManager().add(
                    new SimpleOperation(this.getEditor(), this.getSelection(), property, value));
            });

            this.addUpdater(() => {

                text.readOnly = checkUnlock && !this.isUnlocked(property);

                text.value = this.flatValues_StringOneOrNothing(

                    this.getSelection()

                        .map(obj => property.getValue(obj))
                );
            });

            return text;
        }

        createBooleanField(parent: HTMLElement, property: IProperty<T>, checkUnlock = true) {

            const labelElement = this.createLabel(parent, property.label, property.tooltip);

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

            return checkElement;
        }

    }
}