namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export abstract class ObjectSceneSection<T extends ISceneObjectLike> extends editor.properties.BaseSceneSection<T> {

        createLock(parent: HTMLElement, ...properties: Array<IProperty<T>>) {

            const mutableIcon = new controls.MutableIcon();

            const element = mutableIcon.getElement();
            parent.appendChild(element);

            const lockedIcon = ScenePlugin.getInstance().getIcon(ICON_LOCKED);
            const unlockedIcon = ScenePlugin.getInstance().getIcon(ICON_UNLOCKED);

            element.addEventListener("click", e => {

                const unlocked = !this.isUnlocked(...properties);

                for (const obj of this.getSelection()) {

                    for (const property of properties) {

                        const support = obj.getEditorSupport();

                        if (!unlocked) {

                            const prefabSer = support.getPrefabSerializer();

                            const propValue = prefabSer.read(property.name, property.defValue);

                            property.setValue(obj, propValue);
                        }

                        support.setUnlockedProperty(property.name, unlocked);
                    }
                }

                this.updateWithSelection();

                this.getEditor().repaint();
            });

            this.addUpdater(() => {

                const unlocked = this.isUnlocked(...properties);

                mutableIcon.setIcon(unlocked ? unlockedIcon : lockedIcon);

                mutableIcon.repaint();
            });
        }

        private isUnlocked(...properties: Array<IProperty<T>>) {

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

        // tslint:disable-next-line:ban-types
        createFloatField(parent: HTMLElement, property: IProperty<T>) {

            const text = this.createText(parent, false);

            text.addEventListener("change", e => {

                const val = Number.parseFloat(text.value);

                this.getEditor().getUndoManager().add(
                    new SimpleOperation(this.getEditor(), this.getSelection(), property, val));
            });

            this.addUpdater(() => {

                const values = [];

                for (const obj of this.getSelection()) {

                    const value = property.getValue(obj);
                    values.push(value);
                }

                text.value = values.length === 1 ? values[0].toString() : "";
            });

            return text;
        }

    }
}