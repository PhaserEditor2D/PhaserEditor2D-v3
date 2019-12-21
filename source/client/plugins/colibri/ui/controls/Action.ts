namespace colibri.ui.controls {

    export const EVENT_ACTION_CHANGED = "actionChanged";

    export declare type ActionConfig = {
        text?: string,
        icon?: IImage,
        enabled?: boolean,
        showText?: boolean,
        callback?: () => void
    };

    export class Action extends EventTarget {

        private _text: string;
        private _icon: IImage;
        private _enabled: boolean;
        private _showText: boolean;
        private _callback: () => void;

        constructor(config: ActionConfig) {
            super();

            this._text = config.text ?? "";
            this._showText = config.showText === true;
            this._icon = config.icon ?? null;
            this._enabled = config.enabled === undefined || config.enabled;
            this._callback = config.callback ?? null;
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

        getIcon() {
            return this._icon;
        }

        run(e? : MouseEvent) {

            if (this._callback) {
                this._callback();
            }
        }

    }
}