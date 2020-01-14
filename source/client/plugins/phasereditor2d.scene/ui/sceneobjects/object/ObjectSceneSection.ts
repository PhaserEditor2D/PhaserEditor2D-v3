namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export abstract class ObjectSceneSection<T extends ISceneObjectLike> extends editor.properties.BaseSceneSection<T> {

        protected createGridElementWithPropertiesXY(parent: HTMLElement) {

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

                    const locked = !obj.getEditorSupport().isUnlockedProperty(property.name);

                    if (locked) {

                        return false;
                    }
                }
            }

            return true;
        }

        protected createPropertyXYRow(parent: HTMLElement, propXY: IPropertyXY) {

            this.createLock(parent, propXY.x, propXY.y);

            this.createLabel(parent, propXY.label);

            for (const prop of [propXY.x, propXY.y]) {

                this.createLabel(parent, "X");
                this.createFloatField(parent, prop);
            }
        }

        // tslint:disable-next-line:ban-types
        createFloatField(parent: HTMLElement, property: IProperty<T>) {

            const text = this.createText(parent, false);

            text.addEventListener("change", e => {

                const val = Number.parseFloat(text.value);

                this.getEditor().getUndoManager().add(
                    new SimpleOperation(this.getEditor(), this.getSelection(), property, val));
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

    }
}