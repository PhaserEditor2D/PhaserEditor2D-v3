namespace colibri.ui.controls {

    export declare type IListener<TArg> = (arg: TArg) => any;

    export const CANCEL_EVENT = "colibri.ui.controls.CANCEL_EVENT";

    export class ListenerList<TArg> {

        private _listeners: Array<IListener<TArg>>;

        constructor() {

            this._listeners = [];
        }

        addListener(listener: IListener<TArg>) {

            const list = [...this._listeners];

            list.push(listener);

            this._listeners = list;
        }

        removeListener(listener: IListener<TArg>) {

            const list = this._listeners.filter(l => l !== listener);

            this._listeners = list;
        }

        fire(listenerArgs?: TArg) {

            for (const l of this._listeners) {

                const result = l(listenerArgs);

                if (result === CANCEL_EVENT) {

                    return false;
                }
            }

            return true;
        }
    }
}