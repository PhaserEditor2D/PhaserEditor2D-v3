namespace colibri.ui.ide.actions {

    export abstract class PartAction<T extends ide.Part> extends controls.Action {

        private _part: T;

        constructor(part: T, config: controls.IActionConfig) {
            super(config);

            this._part = part;
        }

        getPart() {
            return this._part;
        }

    }
}