/// <reference path="./SceneObjectSection.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export abstract class SceneGameObjectSection<T extends ISceneGameObject> extends SceneObjectSection<T> {

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

        createSeparatorForXYGrid(parent: HTMLElement, text: string) {

            const label = this.createSeparator(parent, text);

            label.style.gridColumn = "span 6";

            return label;
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

            const lockedIcon = resources.getIcon(resources.ICON_LOCKED);
            const unlockedIcon = resources.getIcon(resources.ICON_UNLOCKED);

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

        createNumberPropertyRow(parent: HTMLElement, prop: IProperty<any>, fullWidth = true) {

            this.createLock(parent, prop);

            const label = this.createLabel(parent, prop.label, PhaserHelp(prop.tooltip));
            label.style.gridColumn = "2 / span 2";

            const text = this.createFloatField(parent, prop);
            text.style.gridColumn = fullWidth ? "4 / span 3" : "4";

            this.createPropertyLabelToTextNumericLink(prop, label, text);

            return {
                labelElement: label,
                textElement: text
            };
        }

        createPropertyLabelToTextNumericLink(prop: IProperty<any>, label: HTMLElement, text: HTMLInputElement) {

            if (prop.increment) {

                this.createLabelToTextNumericLink(label, text, prop.increment, prop.incrementMin, prop.incrementMax, prop.incrementValueComputer);
            }
        }

        createNumberProperty(parent: HTMLElement, prop: IProperty<any>) {

            this.createLock(parent, prop);

            const label = this.createLabel(parent, prop.label, PhaserHelp(prop.tooltip));

            const text = this.createFloatField(parent, prop);

            this.createPropertyLabelToTextNumericLink(prop, label, text);
        }

        createPropertyBoolean(parent: HTMLElement, prop: IProperty<any>, lockIcon = true) {

            if (lockIcon) {

                this.createLock(parent, prop);
            }

            const elements = this.createBooleanField(parent, prop, lockIcon);
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

            this.createPropertyLabelToTextNumericLink(prop, label, text);

            return text;
        }

        createPropertyStringRow(
            parent: HTMLElement,
            prop: IProperty<any>,
            lockIcon: boolean = true,
            readOnly = false,
            incrementable = false) {

            if (lockIcon) {

                this.createLock(parent, prop);
            }

            const label = this.createLabel(parent, prop.label, PhaserHelp(prop.tooltip));
            label.style.gridColumn = "2";

            let text: HTMLInputElement | HTMLTextAreaElement;

            if (incrementable) {

                text = this.createIncrementableStringField(parent, prop);

                this.createPropertyLabelToTextNumericLink(prop, label, text);

            } else {

                text = this.createStringField(parent, prop, true, false, false, readOnly);
            }

            return { label, text };
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

        createKeyCodeRow(parent: HTMLElement, prop: IProperty<any>, lockIcon: boolean = true) {

            if (lockIcon) {

                this.createLock(parent, prop);
            }

            const labelElement = this.createLabel(parent, prop.label, PhaserHelp(prop.tooltip));
            labelElement.style.gridColumn = "2";

            const buttonElement = this.createKeyCodeField(parent, prop, lockIcon);

            return { labelElement, buttonElement };
        }

        createPropertyEnumRow(parent: HTMLElement, prop: IEnumProperty<any, any>, lockIcon: boolean = true, filter?: (v: any) => boolean) {

            if (lockIcon) {

                this.createLock(parent, prop);
            }

            const label = this.createLabel(parent, prop.label, PhaserHelp(prop.tooltip));
            label.style.gridColumn = "2";

            const btn = this.createEnumField(parent, prop, undefined, filter);

            return btn;
        }

        createPropertyXYRow(parent: HTMLElement, propXY: IPropertyXY, lockIcon: boolean = true, colorAxis = true) {

            const inputElements: HTMLInputElement[] = [];

            if (lockIcon) {

                this.createLock(parent, propXY.x, propXY.y);
                this.createLabel(parent, propXY.label, PhaserHelp(propXY.tooltip));

            } else {

                const label = this.createLabel(parent, propXY.label, PhaserHelp(propXY.tooltip));
                label.style.gridColumn = "2";
            }

            for (const i of [{ prop: propXY.x, axis: "x" }, { prop: propXY.y, axis: "y" }]) {

                let { prop, axis } = i;

                const label = this.createLabel(parent, prop.label, PhaserHelp(prop.tooltip));

                const text = this.createFloatField(parent, prop);
                inputElements.push(text);

                if (colorAxis) {

                    label.classList.add("label-axis-" + axis);
                    text.classList.add("input-axis-" + axis);
                }

                this.createPropertyLabelToTextNumericLink(propXY.x, label, text);
            }

            return inputElements;
        }
    }
}