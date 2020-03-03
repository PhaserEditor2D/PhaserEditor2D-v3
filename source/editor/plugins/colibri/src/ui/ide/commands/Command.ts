namespace colibri.ui.ide.commands {

    export interface ICommandConfig {
        id: string;
        name: string;
        tooltip: string;
        icon?: controls.IImage;
        category: string;
    }

    export class Command {

        private _id: string;
        private _name: string;
        private _tooltip: string;
        private _icon: controls.IImage;
        private _categoryId: string;

        constructor(config: ICommandConfig) {

            this._id = config.id;
            this._name = config.name;
            this._tooltip = config.tooltip;
            this._icon = config.icon ?? null;
            this._categoryId = config.category;
        }

        getCategoryId() {
            return this._categoryId;
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