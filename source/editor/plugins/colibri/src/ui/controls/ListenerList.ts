namespace colibri.ui.controls {

    export declare type IEventEmitterListener = (args) => void;

    export class ListenerList {

        private _listeners: IEventEmitterListener[];

        constructor() {

            this._listeners = [];
        }

        addListener(listener: IEventEmitterListener) {

            const list = [...this._listeners];

            list.push(listener);

            this._listeners = list;
        }

        removeListener(listener: IEventEmitterListener) {

            const list = this._listeners.filter(l => l !== listener);

            this._listeners = list;
        }

        dispatch(listenerArgs?: any) {

            for (const l of this._listeners) {

                l(listenerArgs);
            }
        }
    }
}