namespace colibri.ui.controls {

    interface IActionData {
        btnElement: HTMLElement;
        listener: any;
    }

    export class ToolbarManager {

        private _toolbarElement: HTMLElement;
        private _actionDataMap: Map<Action, IActionData>;

        constructor(toolbarElement: HTMLElement) {

            this._toolbarElement = toolbarElement;
            this._actionDataMap = new Map();
        }

        static isToolbarItem(element: HTMLElement) {


            return this.findToolbarItem(element) !== undefined;
        }

        static findToolbarItem(element: HTMLElement) {

            if (!element) {

                return undefined;
            }

            if (element.classList.contains("ToolbarItem")) {

                return element;
            }

            return this.findToolbarItem(element.parentElement);
        }

        addCommand(commandId: string, config: IActionConfig = {}) {
            config.commandId = commandId;
            this.add(new Action(config));
        }

        addAction(config: IActionConfig) {

            const action = new Action(config);

            this.add(action);

            return action;
        }

        add(action: Action) {

            const btnElement = document.createElement("div");
            btnElement.classList.add("ToolbarItem");
            btnElement.addEventListener("click", e => {
                action.run(e);
            });

            if (action.getIcon()) {

                const iconControl = new controls.IconControl(action.getIcon());
                btnElement.appendChild(iconControl.getCanvas());
            }

            const textElement = document.createElement("div");
            textElement.classList.add("ToolbarItemText");
            btnElement.appendChild(textElement);
            btnElement["__text"] = textElement;

            if (action.isShowText()) {

                if (action.getIcon()) {
                    btnElement.classList.add("ToolbarItemHasTextAndIcon");
                }

            } else {

                btnElement.classList.add("ToolbarItemHideText");
            }

            const tooltip = action.getTooltip() || action.getText() || "";

            const keyString = action.getCommandKeyString();

            if (tooltip) {
                
                controls.Tooltip.tooltipWithKey(btnElement, keyString, tooltip);
            }

            this._toolbarElement.appendChild(btnElement);

            const listener = () => this.updateButtonWithAction(btnElement, action);

            action.eventActionChanged.addListener(listener);

            this.updateButtonWithAction(btnElement, action);

            this._actionDataMap.set(action, {
                btnElement: btnElement,
                listener: listener
            });
        }

        dispose() {

            for (const [action, data] of this._actionDataMap.entries()) {

                action.eventActionChanged.removeListener(data.listener);

                data.btnElement.remove();
            }
        }

        private updateButtonWithAction(btn: HTMLElement, action: Action) {

            const textElement = btn["__text"] as HTMLElement;

            textElement.innerText = action.getText();

            if (action.isSelected()) {

                btn.classList.add("ActionSelected");

            } else {

                btn.classList.remove("ActionSelected");
            }
        }
    }
}