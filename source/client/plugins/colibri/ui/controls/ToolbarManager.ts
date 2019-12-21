namespace colibri.ui.controls {

    declare type ActionData = {
        btnElement: HTMLElement,
        listener: any
    }

    export class ToolbarManager {

        private _toolbarElement: HTMLElement;
        private _actionDataMap: Map<Action, ActionData>;

        constructor(toolbarElement: HTMLElement) {

            this._toolbarElement = toolbarElement;
            this._actionDataMap = new Map();
        }

        add(action: Action) {

            const btnElement = document.createElement("div");
            btnElement.classList.add("ToolbarItem");
            btnElement.addEventListener("click", e => {
                action.run(e);
            });

            if (action.getIcon()) {
                const iconElement = controls.Controls.createIconElement(action.getIcon());
                btnElement.appendChild(iconElement);
                btnElement["__icon"] = iconElement;
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

            let tooltip = action.getTooltip() || action.getText() || "";

            const keyString = action.getCommandKeyString();

            if (tooltip) {
                controls.Tooltip.tooltipWithKey(btnElement, keyString, tooltip);
            }

            this._toolbarElement.appendChild(btnElement);

            const listener = e => this.updateButtonWithAction(btnElement, action);

            action.addEventListener(EVENT_ACTION_CHANGED, listener);

            this.updateButtonWithAction(btnElement, action);

            this._actionDataMap.set(action, {
                btnElement: btnElement,
                listener: listener
            });

        }

        dispose() {

            for (const [action, data] of this._actionDataMap.entries()) {
                action.removeEventListener(EVENT_ACTION_CHANGED, data.listener);
                data.btnElement.remove();
            }
        }

        private updateButtonWithAction(btn: HTMLElement, action: Action) {
            const textElement = <HTMLElement>btn["__text"];
            textElement.innerText = action.getText();
        }

    }
}