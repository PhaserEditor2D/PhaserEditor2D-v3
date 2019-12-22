namespace colibri.ui.controls {

    export const EVENT_ACTION_CHANGED = "actionChanged";

    export declare type ActionConfig = {
        text?: string,
        tooltip?: string,
        icon?: IImage,
        enabled?: boolean,
        showText?: boolean,
        commandId?: string,
        callback?: () => void
    };

    export class Action extends EventTarget {

        private _text: string;
        private _tooltip: string;
        private _commandId: string;
        private _icon: IImage;
        private _enabled: boolean;
        private _showText: boolean;
        private _callback: () => void;

        constructor(config: ActionConfig) {
            super();

            this._text = config.text ?? "";
            this._tooltip = config.tooltip ?? "";
            this._showText = config.showText === true;
            this._icon = config.icon ?? null;
            this._enabled = config.enabled === undefined || config.enabled;
            this._callback = config.callback ?? null;
            this._commandId = config.commandId ?? null;

            if (this._commandId) {

                const manager = Platform.getWorkbench().getCommandManager();

                const command = manager.getCommand(this._commandId);

                if (command) {

                    this._text = this._text || command.getName();
                    this._tooltip = this._tooltip || command.getTooltip();
                    this._icon = this._icon || command.getIcon();
                }
            }
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

                this._callback();

                return;
            }

            if (this._commandId) {

                Platform.getWorkbench().getCommandManager().executeCommand(this._commandId);
            }

        }

    }
}