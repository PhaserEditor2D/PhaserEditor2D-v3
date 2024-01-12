/// <reference path="./StringPropertyType.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export abstract class AbstractDialogPropertyType extends StringPropertyType {

        private _name: string;
        private _hasCustomIcon: boolean;
        private _dialogTitle: string;

        protected constructor(config: {
            id: string,
            name: string,
            dialogTitle: string,
            hasCustomIcon?: boolean
        }) {
            super(config.id);

            this._name = config.name;
            this._dialogTitle = config.dialogTitle;
            this._hasCustomIcon = config.hasCustomIcon === undefined ? false : config.hasCustomIcon;
        }

        getName() {

            return this._name;
        }

        getEditor(): editor.SceneEditor {

            return colibri.Platform.getWorkbench()
                .getActiveWindow().getEditorArea()
                .getSelectedEditor() as editor.SceneEditor;
        }

        createInspectorPropertyEditor(
            section: SceneGameObjectSection<any>, parent: HTMLElement, userProp: UserProperty, lockIcon: boolean, previewAction?: () => void): void {

            const prop = userProp.getComponentProperty();

            if (lockIcon) {

                section.createLock(parent, prop);
            }

            const label = section.createLabel(parent, prop.label, PhaserHelp(prop.tooltip));
            label.style.gridColumn = "2";

            const comp = this.createEditorComp(Boolean(previewAction));
            parent.appendChild(comp);

            const text = section.createStringField(comp, prop);

            const { buttonElement, iconControl } = this.createSearchButton(() => prop.getValue(section.getSelectionFirstElement()), value => {

                text.value = value;

                const editor = section.getEditor();

                editor.getUndoManager().add(
                    new SimpleOperation(editor, section.getSelection(), prop, value));
            });

            section.addUpdater(() => {

                buttonElement.disabled = !section.isUnlocked(prop);

                const value = prop.getValue(section.getSelectionFirstElement());

                this.updateIcon(iconControl, value);
            });

            comp.appendChild(buttonElement);

            if (previewAction) {

                section.createButton(comp, resources.getIcon(resources.ICON_PLAY), () => {

                    previewAction();
                });
            }
        }

        private createEditorComp(withPreviewButton = false) {

            const comp = document.createElement("div");
            comp.style.display = "grid";
            comp.style.gridTemplateColumns = withPreviewButton ? "1fr auto auto" : "1fr auto";
            comp.style.gap = "5px";
            comp.style.alignItems = "center";

            return comp;
        }

        private createSearchButton(getValue: () => any, callback: (value: string) => void) {

            const iconControl = new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));

            const btn = document.createElement("button");
            btn.appendChild(iconControl.getCanvas());

            btn.addEventListener("click", async (e) => {

                const value = getValue();

                this.createSearchDialog(value, callback);
            });


            if (this._hasCustomIcon) {

                this.updateIcon(iconControl, getValue());
            }


            return { buttonElement: btn, iconControl };
        }

        protected async updateIcon(iconControl: controls.IconControl, value: any) {

            // iconControl.setIcon(icon);
        }

        protected hasCustomIcon() {

            return false;
        }

        protected abstract createViewer(): Promise<controls.viewers.TreeViewer>;

        protected getDialogTitle() {

            return this._dialogTitle;
        }

        protected getDialogSize(): { width?: number, height?: number } {

            return {
                width: undefined,
                height: window.innerHeight * 2 / 3
            };
        }

        private async createSearchDialog(revealValue: string, callback: (value: string) => void) {

            const viewer = await this.createViewer();

            viewer.setInput([]);

            const dlg = this.createDialogInstance(viewer, true);

            const size = this.getDialogSize();

            dlg.setSize(size.width, size.height);

            dlg.create();

            dlg.setTitle(this.getDialogTitle());

            dlg.enableButtonOnlyWhenOneElementIsSelected(
                dlg.addOpenButton("Select", sel => {

                    const value = this.valueToString(viewer, sel[0]);

                    callback(value);
                }));

            dlg.addCancelButton();

            await this.loadViewerInput(viewer);

            this.revealValue(viewer, revealValue);

            controls.viewers.GridTreeViewerRenderer.expandSections(viewer);
        }

        protected createDialogInstance(viewer: controls.viewers.TreeViewer, showZoomControls: boolean)
            : controls.dialogs.AbstractViewerDialog {

            return new controls.dialogs.ViewerDialog(viewer, showZoomControls)
        }

        protected abstract valueToString(viewer: controls.viewers.TreeViewer, value: any): string;

        protected abstract loadViewerInput(viewer: controls.viewers.TreeViewer): Promise<void>;

        protected revealValue(viewer: controls.viewers.TreeViewer, value: string) {

            const found = viewer.findElementByLabel(value);

            if (found) {

                viewer.setSelection([found]);
                viewer.reveal(found);
            }
        }

        createEditorElement(getValue: () => any, setValue: (value: any) => void, previewAction?: () => void): IPropertyEditor {

            const comp = this.createEditorComp(Boolean(previewAction));

            const formBuilder = new controls.properties.FormBuilder();

            const inputElement = formBuilder.createText(comp, false);

            inputElement.addEventListener("change", e => {

                setValue(inputElement.value);
            });

            const { buttonElement, iconControl } = this.createSearchButton(getValue, setValue);

            comp.appendChild(buttonElement);

            const update = () => {

                const value = getValue();

                inputElement.value = value;

                this.updateIcon(iconControl, value);
            };

            if (previewAction) {

                formBuilder.createButton(comp, resources.getIcon(resources.ICON_PLAY), () => {

                    previewAction();
                });
            }

            return {
                element: comp,
                update
            };
        }

        protected formatKeyFrame(key: string, frame?: string | number) {

            if (frame === undefined || frame === null) {

                return key;
            }

            return frame.toString();
        }
    }
}