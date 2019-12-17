namespace colibri.ui.ide.commands {

    export class KeyMatcher {

        private _control: boolean;
        private _shift: boolean;
        private _alt: boolean;
        private _meta: boolean;
        private _key: string;
        private _filterInputElements: boolean;

        constructor(config: {
            control?: boolean,
            shift?: boolean,
            alt?: boolean,
            meta?: boolean,
            key?: string,
            filterInputElements?: boolean
        }) {

            this._control = config.control === undefined ? false : config.control;
            this._shift = config.shift === undefined ? false : config.shift;
            this._alt = config.alt === undefined ? false : config.alt;
            this._meta = config.meta === undefined ? false : config.meta;
            this._key = config.key === undefined ? "" : config.key;
            this._filterInputElements = config.filterInputElements === undefined ? true : config.filterInputElements
        }

        matchesKeys(event: KeyboardEvent) {
            return event.ctrlKey === this._control
                && event.shiftKey === this._shift
                && event.altKey === this._alt
                && event.metaKey === this._meta
                && event.key.toLowerCase() === this._key.toLowerCase();
        }

        matchesTarget(element: EventTarget) {
            if (this._filterInputElements) {
                return !(element instanceof HTMLInputElement);
            }
            return true;
        }
    }

}