namespace colibri.ui.controls.properties {

    export interface ICreateButtonDialogArgs {

        getValue: () => any,
        onValueSelected: (value: string) => void,
        updateIconCallback?: (iconControl: IconControl, value: any) => Promise<void>,
        createDialogViewer: (revealValue: string) => Promise<controls.viewers.TreeViewer>,
        dialogElementToString: (viewer: colibri.ui.controls.viewers.TreeViewer, value: any) => string,
        dialogTittle: string
    }

    export class FormBuilder {

        createSeparator(parent: HTMLElement, text: string) {

            const label = document.createElement("label");
            label.classList.add("formSeparator");
            label.innerText = text;

            parent.appendChild(label);

            return label;
        }

        createLabel(parent: HTMLElement, text = "", tooltip = "") {

            const label = document.createElement("label");

            label.classList.add("formLabel");
            label.innerText = text;

            if (tooltip) {
                Tooltip.tooltip(label, tooltip);
            }

            parent.appendChild(label);

            return label;
        }

        createButton(parent: HTMLElement, text: string, callback: (e?: MouseEvent) => void) {

            const btn = document.createElement("button");

            btn.innerText = text;

            btn.addEventListener("click", e => callback(e));

            if (parent) {

                parent.appendChild(btn);
            }

            return btn;
        }

        createMenuButton(
            parent: HTMLElement, text: string,
            getItems: () => Array<{ name: string, value: any, icon?: controls.IImage }>,
            callback: (value: any) => void) {

            const btn = this.createButton(parent, text, e => {

                const menu = new controls.Menu();

                for (const item of getItems()) {

                    menu.add(new Action({
                        text: item.name,
                        icon: item.icon,
                        callback: () => {
                            callback(item.value);
                        }
                    }));
                }

                menu.createWithEvent(e);
            });

            return btn;
        }

        createText(parent: HTMLElement, readOnly = false) {

            const text = document.createElement("input");

            text.type = "text";
            text.classList.add("formText");
            text.readOnly = readOnly;

            parent.appendChild(text);

            return text;
        }

        createButtonDialog(args: ICreateButtonDialogArgs) {

            const iconControl = new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));

            const buttonElement = document.createElement("button");
            buttonElement.appendChild(iconControl.getCanvas());

            buttonElement.addEventListener("click", async (e) => {

                const value = args.getValue();

                const viewer = await args.createDialogViewer(value);

                const dlg = new controls.dialogs.ViewerDialog(viewer, true);

                dlg.setSize(undefined, window.innerHeight * 2 / 3);

                dlg.create();

                dlg.setTitle(args.dialogTittle);

                dlg.enableButtonOnlyWhenOneElementIsSelected(
                    dlg.addOpenButton("Select", sel => {

                        const obj = sel[0];

                        const value = args.dialogElementToString(viewer, obj);

                        args.onValueSelected(value);

                        if (args.updateIconCallback) {

                            args.updateIconCallback(iconControl, value);
                        }
                    }));

                dlg.addCancelButton();

                controls.viewers.GridTreeViewerRenderer.expandSections(viewer);
            });

            const updateDialogButtonIcon = () => {

                if (args.updateIconCallback) {

                    const value = args.getValue();

                    args.updateIconCallback(iconControl, value);
                }
            };

            updateDialogButtonIcon();

            return { buttonElement, updateDialogButtonIcon };
        }

        createTextDialog(parent: HTMLElement, dialogTitle: string, readOnly = false) {

            const text = this.createTextArea(parent, false);
            text.rows = 1;

            const btn = document.createElement("button");
            btn.textContent = "...";
            btn.addEventListener("click", () => {

                const dlg = new StringDialog();

                dlg.create();

                dlg.setTitle(dialogTitle);

                dlg.addButton("Accept", () => {

                    text.value = dlg.getValue();
                    text.dispatchEvent(new Event("change"));

                    dlg.close();
                });

                dlg.addCancelButton();

                dlg.setValue(text.value);
            });

            const container = document.createElement("div");
            container.classList.add("StringDialogField")

            container.appendChild(text);
            container.appendChild(btn);

            parent.appendChild(container);

            return { container, text, btn };
        }

        createColor(parent?: HTMLElement, readOnly = false, allowAlpha = true) {

            const text = document.createElement("input");

            text.type = "text";
            text.classList.add("formText");
            text.readOnly = readOnly;

            const btn = document.createElement("button");
            // btn.textContent = "...";
            btn.classList.add("ColorButton");
            btn.appendChild(
                new IconControl(ColibriPlugin.getInstance().getIcon(colibri.ICON_COLOR)).getCanvas());

            const colorElement = document.createElement("div");
            colorElement.style.display = "grid";
            colorElement.style.gridTemplateColumns = "1fr auto";
            colorElement.style.gap = "5px";
            colorElement.style.alignItems = "center";
            colorElement.appendChild(text);
            colorElement.appendChild(btn);

            if (parent) {

                parent.appendChild(colorElement);
            }

            btn.addEventListener("mousedown", e => {

                if (text.readOnly) {

                    return;
                }

                e.preventDefault();
                e.stopImmediatePropagation();

                if (ColorPickerManager.isActivePicker()) {

                    ColorPickerManager.closeActive();

                    return;
                }

                const picker = ColorPickerManager.createPicker();

                btn["__picker"] = picker;

                picker.setOptions({
                    popup: "left",
                    editor: false,
                    alpha: allowAlpha,
                    onClose: () => {

                        ColorPickerManager.closeActive();
                    },
                    onDone: (color) => {

                        text.value = allowAlpha ? color.hex : color.hex.substring(0, 7);
                        btn.style.background = text.value;
                        text.dispatchEvent(new CustomEvent("change"));
                    }
                });

                try {

                    picker.setColour(text.value, false);

                } catch (e) {

                    picker.setColour("#fff", false);
                }

                picker.show();

                const pickerElement = picker.domElement as HTMLElement;
                const pickerBounds = pickerElement.getBoundingClientRect();
                const textBounds = text.getBoundingClientRect();

                pickerElement.getElementsByClassName("picker_arrow")[0].remove();

                let top = textBounds.top - pickerBounds.height;

                if (top + pickerBounds.height > window.innerHeight) {

                    top = window.innerHeight - pickerBounds.height;
                }

                if (top < 0) {

                    top = textBounds.bottom;
                }

                let left = textBounds.left;

                if (left + pickerBounds.width > window.innerWidth) {

                    left = window.innerWidth - pickerBounds.width;
                }

                pickerElement.style.top = top + "px";
                pickerElement.style.left = left + "px";

            });

            return {
                element: colorElement,
                text: text,
                btn: btn
            };
        }

        createTextArea(parent: HTMLElement, readOnly = false) {

            const text = document.createElement("textarea");

            text.classList.add("formText");
            text.readOnly = readOnly;

            parent.appendChild(text);

            return text;
        }

        private static NEXT_ID = 0;

        createCheckbox(parent: HTMLElement, label?: HTMLLabelElement) {

            const check = document.createElement("input");

            if (label) {

                const id = (PropertySection.NEXT_ID++).toString();

                label.htmlFor = id;

                check.setAttribute("id", id);
            }

            check.type = "checkbox";
            check.classList.add("formCheckbox");

            parent.appendChild(check);

            return check;
        }

        createMenuIcon(parent: HTMLElement, menuProvider: () => Menu) {

            const icon = new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_SMALL_MENU));

            icon.getCanvas().classList.add("IconButton");

            parent.appendChild(icon.getCanvas());

            icon.getCanvas().addEventListener("click", e => {

                const menu = menuProvider();

                menu.createWithEvent(e);
            });

            return icon;
        }

        createIcon(parent: HTMLElement, iconImage: IImage) {

            const icon = new controls.IconControl(iconImage);

            parent.appendChild(icon.getCanvas());

            return icon;
        }
    }
}