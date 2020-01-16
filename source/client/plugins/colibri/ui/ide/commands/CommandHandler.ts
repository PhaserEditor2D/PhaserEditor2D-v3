namespace colibri.ui.ide.commands {

    export interface IHandlerConfig {

        testFunc?: (args: HandlerArgs) => boolean;
        executeFunc?: (args: HandlerArgs) => void;
    }

    export class CommandHandler {

        private _testFunc: (args: HandlerArgs) => boolean;
        private _executeFunc: (args: HandlerArgs) => void;

        constructor(config: IHandlerConfig) {

            this._testFunc = config.testFunc;
            this._executeFunc = config.executeFunc;
        }

        test(args: HandlerArgs) {
            return this._testFunc ? this._testFunc(args) : true;
        }

        execute(args: HandlerArgs): void {

            if (this._executeFunc) {
                this._executeFunc(args);
            }

        }
    }

}