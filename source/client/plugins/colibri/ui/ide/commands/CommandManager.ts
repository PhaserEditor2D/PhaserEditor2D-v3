namespace colibri.ui.ide.commands {

    export class CommandManager {

        private _commandIdMap: Map<String, Command>;
        private _commands: Command[];
        private _commandMatcherMap: Map<Command, KeyMatcher[]>;
        private _commandHandlerMap: Map<Command, CommandHandler[]>;

        constructor() {

            this._commands = [];
            this._commandIdMap = new Map();
            this._commandMatcherMap = new Map();
            this._commandHandlerMap = new Map();

            window.addEventListener("keydown", e => { this.onKeyDown(e); })
        }

        private onKeyDown(event: KeyboardEvent): void {

            if (event.isComposing) {
                return;
            }

            const args = this.makeArgs();

            for (const command of this._commands) {

                let eventMatches = false;

                const matchers = this._commandMatcherMap.get(command);

                for (const matcher of matchers) {

                    if (matcher.matchesKeys(event) && matcher.matchesTarget(event.target)) {

                        eventMatches = true;

                        break;
                    }
                }

                if (eventMatches) {

                    this.executeHandler(command, args);
                }
            }
        }

        private executeHandler(command: Command, args: CommandArgs) {
            const handlers = this._commandHandlerMap.get(command);

            for (const handler of handlers) {

                if (handler.test(args)) {

                    event.preventDefault();

                    handler.execute(args);

                    return;
                }
            }
        }

        addCommand(cmd: Command): void {
            this._commands.push(cmd);
            this._commandIdMap.set(cmd.getId(), cmd);
            this._commandMatcherMap.set(cmd, []);
            this._commandHandlerMap.set(cmd, []);
        }

        addCommandHelper(config: {
            id: string,
            name: string,
            tooltip: string,
            icon?: controls.IImage
        }) {
            this.addCommand(new Command(config));
        }

        private makeArgs() {

            const wb = Workbench.getWorkbench();

            const activeMenu = controls.Menu.getActiveMenu();
            let activeElement = wb.getActiveElement();

            if (activeMenu) {
                activeElement = activeMenu.getElement();
            }

            return new CommandArgs(
                wb.getActivePart(),
                wb.getActiveEditor(),
                activeElement,
                activeMenu,
                wb.getActiveWindow(),
                wb.getActiveDialog()
            );
        }

        getCommand(id: string) {
            const command = this._commandIdMap.get(id);

            if (!command) {
                console.error(`Command ${id} not found.`);
            }

            return command;
        }

        getCommandKeyString(commandId: string) {

            const command = this.getCommand(commandId);

            if (command) {

                const matchers = this._commandMatcherMap.get(command);

                if (matchers && matchers.length > 0) {

                    const matcher = matchers[0];

                    return matcher.getKeyString();
                }
            }

            return "";
        }

        executeCommand(commandId: string) {

            const command = this.getCommand(commandId);

            if (command) {

                this.executeHandler(command, this.makeArgs());
            }
        }

        addKeyBinding(commandId: string, matcher: KeyMatcher): void {
            const command = this.getCommand(commandId);

            if (command) {
                this._commandMatcherMap.get(command).push(matcher);
            }
        }

        addHandler(commandId: string, handler: CommandHandler) {

            const command = this.getCommand(commandId);

            if (command) {
                this._commandHandlerMap.get(command).push(handler);
            }
        }

        addHandlerHelper(commandId: string, testFunc: (args: CommandArgs) => boolean, executeFunc: (args: CommandArgs) => void) {

            this.addHandler(commandId, new CommandHandler({
                testFunc: testFunc,
                executeFunc: executeFunc
            }));
        }
    }

}