namespace colibri.ui.ide.commands {

    export class CommandManager {

        private _commandIdMap: Map<string, Command>;
        private _commands: Command[];
        private _commandMatcherMap: Map<Command, KeyMatcher[]>;
        private _commandHandlerMap: Map<Command, CommandHandler[]>;
        private _categoryMap: Map<string, ICommandCategory>;
        private _categories: ICommandCategory[];

        constructor() {

            this._commands = [];
            this._commandIdMap = new Map();
            this._commandMatcherMap = new Map();
            this._commandHandlerMap = new Map();
            this._categoryMap = new Map();
            this._categories = [];

            window.addEventListener("keydown", e => { this.onKeyDown(e); });
        }

        printTable() {

            let str = [
                "Category",
                "Command",
                "Keys",
                "Description"

            ].join(",") + "\n";

            for (const cat of this._categories) {

                const catName = cat.name;

                const commands = this._commands.filter(c => c.getCategoryId() === cat.id);

                for (const cmd of commands) {

                    const keys = this.getCommandKeyString(cmd.getId());

                    str += [
                        '"' + catName + '"',
                        '"' + cmd.getName() + '"',
                        '"``' + keys + '``"',
                        '"' + cmd.getTooltip() + '"'
                    ].join(",") + "\n";
                }
            }

            const elem = document.createElement("a");

            elem.download = "phasereditor2d-commands-palette.csv";
            elem.style.display = "none";
            elem.href = "data:text/plain;charset=utf-8," + encodeURIComponent(str);

            document.body.appendChild(elem);

            elem.click();

            document.body.removeChild(elem);
        }

        private onKeyDown(event: KeyboardEvent): void {

            if (event.isComposing) {

                return;
            }

            let executed = false;

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

                    executed = this.executeHandler(command, args, event);
                }
            }

            if (!executed) {

                this.preventKeyEvent(event);
            }
        }

        private preventKeyEvent(event: KeyboardEvent) {

            const code = [
                event.metaKey || event.ctrlKey ? "ctrl" : "",
                event.shiftKey ? "shift" : "",
                event.altKey ? "alt" : "",
                event.key.toLowerCase()
            ].filter(s => s.length > 0).join(" ");

            switch (code) {
                case "ctrl s":
                case "ctrl shift s":
                case "ctrl w":
                case "ctrl shift w":
                    event.preventDefault();
                    break;
            }
        }

        canRunCommand(commandId: string) {

            const args = this.makeArgs();

            const command = this.getCommand(commandId);

            if (command) {

                const handlers = this._commandHandlerMap.get(command);

                for (const handler of handlers) {

                    if (this.testHandler(handler, args)) {

                        return true;
                    }
                }
            }

            return false;
        }

        private testHandler(handler: CommandHandler, args: HandlerArgs) {

            // const dlg = colibri.Platform.getWorkbench().getActiveDialog();

            // if (dlg) {

            //     if (!(dlg instanceof controls.dialogs.CommandDialog) && !dlg.processKeyCommands()) {

            //         return false;
            //     }
            // }

            return handler.test(args);
        }

        private executeHandler(command: Command, args: HandlerArgs, event: KeyboardEvent, checkContext: boolean = true): boolean {

            const handlers = this._commandHandlerMap.get(command);

            for (const handler of handlers) {

                if (!checkContext || this.testHandler(handler, args)) {

                    if (event) {

                        event.preventDefault();
                    }

                    const dlg = colibri.Platform.getWorkbench().getActiveDialog();

                    if (dlg instanceof controls.dialogs.CommandDialog) {

                        dlg.close();
                    }

                    handler.execute(args);

                    return true;
                }
            }

            return false;
        }

        addCategory(category: ICommandCategory) {

            this._categoryMap.set(category.id, category);
            this._categories.push(category);
        }

        getCategories() {
            return this._categories;
        }

        getCategory(id: string) {

            return this._categoryMap.get(id);
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
            category: string,
            icon?: controls.IImage,
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

            // do not consider the command palette dialog as active dialog,
            // because we can execute any command there!
            const activeDialog = wb.getActiveDialog() instanceof ui.controls.dialogs.CommandDialog
                ? null : wb.getActiveDialog();

            let activeEditor = wb.getActiveEditor();

            if (activeDialog) {

                if (activeDialog instanceof QuickEditorDialog) {

                    activeEditor = activeDialog.getEditor();

                } else {

                    activeEditor = null;
                }
            }

            return new HandlerArgs(
                activeDialog ? null : wb.getActivePart(),
                activeEditor,
                activeElement,
                activeMenu,
                wb.getActiveWindow(),
                activeDialog
            );
        }

        getCommands() {

            const list = [...this._commands];

            list.sort((a, b) => {

                return ((a.getCategoryId() || "") + a.getName())
                    .localeCompare((b.getCategoryId() || "") + b.getName());
            });

            return list;
        }

        getActiveCommands() {

            return this.getCommands().filter(

                command => this.canRunCommand(command.getId())
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

        executeCommand(commandId: string, checkContext: boolean = true) {

            const command = this.getCommand(commandId);

            if (command) {

                this.executeHandler(command, this.makeArgs(), null, checkContext);
            }
        }

        addKeyBinding(commandId: string, matcher: KeyMatcher): void {
            const command = this.getCommand(commandId);

            if (command) {
                this._commandMatcherMap.get(command).push(matcher);
            }
        }

        addKeyBindingHelper(commandId: string, config: IKeyMatcherConfig) {

            this.addKeyBinding(commandId, new KeyMatcher(config));
        }

        addHandler(commandId: string, handler: CommandHandler) {

            const command = this.getCommand(commandId);

            if (command) {

                this._commandHandlerMap.get(command).push(handler);
            }
        }

        addHandlerHelper(
            commandId: string, testFunc: (args: HandlerArgs) => boolean, executeFunc: (args: HandlerArgs) => void) {

            this.addHandler(commandId, new CommandHandler({
                testFunc: testFunc,
                executeFunc: executeFunc
            }));
        }

        add(
            args: {
                command?: ICommandConfig,
                handler?: IHandlerConfig,
                keys?: IKeyMatcherConfig | IKeyMatcherConfig[],
            },
            commandId?: string) {

            if (args.command) {

                this.addCommandHelper(args.command);

            }

            const id = args.command ? args.command.id : commandId;

            if (args.handler) {

                this.addHandler(id, new CommandHandler(args.handler));
            }

            if (args.keys) {

                if (Array.isArray(args.keys)) {

                    for(const key of args.keys) {

                        this.addKeyBinding(id, new KeyMatcher(key));
                    }

                } else {

                    this.addKeyBinding(id, new KeyMatcher(args.keys));
                }
            }
        }
    }

}