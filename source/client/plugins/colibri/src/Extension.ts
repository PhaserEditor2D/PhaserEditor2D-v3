namespace colibri {

    export class Extension {

        static DEFAULT_PRIORITY: number;

        private _extensionPoint;
        private _priority: number;

        constructor(extensionPoint: string, priority: number = 10) {
            this._extensionPoint = extensionPoint;
            this._priority = priority;
        }

        getExtensionPoint() {
            return this._extensionPoint;
        }

        getPriority() {
            return this._priority;
        }

        setPriority(priority: number) {
            this._priority = priority;
        }
    }
}