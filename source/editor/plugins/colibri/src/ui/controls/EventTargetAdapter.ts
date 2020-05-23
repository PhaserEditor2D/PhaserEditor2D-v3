namespace colibri.ui.controls {

    export class EventTargetAdapter {
        private _eventTarget: EventTarget;

        constructor(eventTarget?: EventTarget) {

            this._eventTarget = eventTarget;
        }

        setEventTarget(eventTarget: EventTarget) {

            this._eventTarget = eventTarget;
        }

        addEventListener(
            type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) {

            this._eventTarget.addEventListener(type, listener, options);
        }

        removeEventListener(
            type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean) {

            this._eventTarget.removeEventListener(type, callback, options);
        }

        dispatchEvent(event: Event) {

            return this._eventTarget.dispatchEvent(event);
        }
    }
}