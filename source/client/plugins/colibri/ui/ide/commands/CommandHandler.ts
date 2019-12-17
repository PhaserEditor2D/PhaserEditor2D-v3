namespace colibri.ui.ide.commands {

    export class CommandHandler {

        private _testFunc: (args: CommandArgs) => boolean;
        private _executeFunc: (args: CommandArgs) => void;

        constructor(config: {
            testFunc?: (args: CommandArgs) => boolean,
            executeFunc?: (args: CommandArgs) => void
        }) {

            this._testFunc = config.testFunc;
            this._executeFunc = config.executeFunc;

        }

        test(args: CommandArgs) {
            return this._testFunc ? this._testFunc(args) : true;
        }

        execute(args: CommandArgs): void {

            if (this._executeFunc) {
                this._executeFunc(args);
            }

        }
    }

}