namespace colibri.ui.controls.properties {

    export class FormBuilder {


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

            parent.appendChild(btn);

            return btn;
        }

        createMenuButton(
            parent: HTMLElement, text: string,
            items: Array<{ name: string, value: any, icon?: controls.IImage }>,
            callback: (value: any) => void) {

            const btn = this.createButton(parent, text, e => {

                const menu = new controls.Menu();

                for (const item of items) {

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

        createColor(parent: HTMLElement, readOnly = false, allowAlpha = true) {

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
            colorElement.style.gridGap = "5px";
            colorElement.style.alignItems = "center";
            colorElement.appendChild(text);
            colorElement.appendChild(btn);

            parent.appendChild(colorElement);

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
                    alpha: false,
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
    }
}