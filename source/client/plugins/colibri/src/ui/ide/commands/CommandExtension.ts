namespace colibri.ui.ide.commands {

    export class CommandExtension extends Extension {

        static POINT_ID = "colibri.ui.ide.commands";

        private _configurer: (manager: CommandManager) => void;

        constructor(configurer: (manager: CommandManager) => void) {
            super(CommandExtension.POINT_ID);

            this._configurer = configurer;
        }

        getConfigurer() {
            return this._configurer;
        }

    }

}