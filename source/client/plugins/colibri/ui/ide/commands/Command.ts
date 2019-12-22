namespace colibri.ui.ide.commands {

    export class Command {

        private _id: string;
        private _name: string;
        private _tooltip: string;
        private _icon: controls.IImage;

        constructor(config: {
            id: string,
            name: string,
            tooltip: string,
            icon?: controls.IImage
        }) {

            this._id = config.id;
            this._name = config.name;
            this._tooltip = config.tooltip;
            this._icon = config.icon ?? null;
        }

        getId() {
            return this._id;
        }

        getName() {
            return this._name;
        }

        getTooltip() {
            return this._tooltip;
        }

        getIcon() {
            return this._icon;
        }
    }

}