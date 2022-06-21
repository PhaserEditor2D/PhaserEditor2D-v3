namespace colibri.ui.controls {

    export interface IActionConfig {

        text?: string;
        tooltip?: string;
        icon?: IImage;
        enabled?: boolean;
        showText?: boolean;
        commandId?: string;
        selected?: boolean;
        callback?(e?: MouseEvent, a?: Action): void;
    }

    export class Action {

        private _text: string;
        private _tooltip: string;
        private _commandId: string;
        private _icon: IImage;
        private _enabled: boolean;
        private _showText: boolean;
        private _selected: boolean;
        private _callback: (e?: MouseEvent, action?: Action) => void;
        public eventActionChanged = new  ListenerList();

        constructor(config: IActionConfig) {

            this._text = config.text ?? "";
            this._tooltip = config.tooltip ?? "";
            this._showText = config.showText !== false;
            this._icon = config.icon ?? null;
            this._enabled = config.enabled === undefined || config.enabled;
            this._callback = config.callback ?? null;
            this._commandId = config.commandId ?? null;
            this._selected = config.selected ?? false;

            if (this._commandId) {

                const manager = Platform.getWorkbench().getCommandManager();

                const command = manager.getCommand(this._commandId);

                if (command) {

                    this._text = this._text || command.getName();
                    this._tooltip = this._tooltip || command.getTooltip();
                    this._icon = this._icon || command.getIcon();
                    this._enabled = config.enabled === undefined
                        ? manager.canRunCommand(command.getId())
                        : config.enabled;
                }
            }
        }

        isSelected() {
            return this._selected;
        }

        setSelected(selected: boolean) {

            this._selected = selected;

            this.eventActionChanged.fire();
        }

        getCommandId() {
            return this._commandId;
        }

        getCommandKeyString() {

            if (!this._commandId) {
                return "";
            }

            const manager = Platform.getWorkbench().getCommandManager();

            return manager.getCommandKeyString(this._commandId);
        }

        isEnabled() {
            return this._enabled;
        }

        isShowText() {
            return this._showText;
        }

        getText() {
            return this._text;
        }

        getTooltip() {
            return this._tooltip;
        }

        getIcon() {
            return this._icon;
        }

        run(e?: MouseEvent) {

            if (this._callback) {

                this._callback(e, this);

                return;
            }

            if (this._commandId) {

                Platform.getWorkbench().getCommandManager().executeCommand(this._commandId);
            }
        }
    }
}