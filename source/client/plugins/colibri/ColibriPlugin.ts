/// <reference path="./Plugin.ts" />
/// <reference path="./Platform.ts" />
/// <reference path="./ui/ide/Workbench.ts" />

namespace colibri {

    export class ColibriPlugin extends colibri.Plugin {

        private static _instance;

        static getInstance() {
            return this._instance ?? (this._instance = new ColibriPlugin());
        }

        private _openingProject: boolean;

        private constructor() {
            super("colibri");

            this._openingProject = false;
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            // themes

            reg.addExtension(
                new colibri.ui.ide.themes.ThemeExtension(colibri.ui.controls.Controls.LIGHT_THEME),
                new colibri.ui.ide.themes.ThemeExtension(colibri.ui.controls.Controls.DARK_THEME)
            );

            // keys

            reg.addExtension(
                new colibri.ui.ide.commands.CommandExtension(
                    ui.ide.actions.IDECommands.registerCommands
                )
            );
        }
    }

    Platform.addPlugin(ColibriPlugin.getInstance());
}