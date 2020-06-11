/// <reference path="./src/Plugin.ts" />
/// <reference path="./src/ui/ide/Workbench.ts" />

namespace colibri {

    export const ICON_FILE = "file";
    export const ICON_FOLDER = "folder";
    export const ICON_PLUS = "plus";
    export const ICON_MINUS = "minus";
    export const ICON_CHECKED = "checked";
    export const ICON_MENU = "menu";
    export const ICON_SMALL_MENU = "small-menu";
    export const ICON_KEYMAP = "keymap";
    export const ICON_CONTROL_TREE_COLLAPSE = "tree-collapse";
    export const ICON_CONTROL_TREE_EXPAND = "tree-expand";
    export const ICON_CONTROL_CLOSE = "close";
    export const ICON_CONTROL_DIRTY = "dirty";

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

            reg.addExtension(
                colibri.ui.ide.IconLoaderExtension.withPluginFiles(this, [
                    ICON_FILE,
                    ICON_FOLDER,
                    ICON_PLUS,
                    ICON_MINUS,
                    ICON_CHECKED,
                    ICON_MENU,
                    ICON_SMALL_MENU,
                    ICON_KEYMAP,
                    ICON_CONTROL_TREE_COLLAPSE,
                    ICON_CONTROL_TREE_EXPAND,
                    ICON_CONTROL_CLOSE,
                    ICON_CONTROL_DIRTY
                ])
            );

            // themes

            reg.addExtension(
                new colibri.ui.ide.themes.ThemeExtension(colibri.ui.controls.Controls.LIGHT_THEME),
                new colibri.ui.ide.themes.ThemeExtension(colibri.ui.controls.Controls.DARK_THEME)
            );

            // keys

            reg.addExtension(
                new colibri.ui.ide.commands.CommandExtension(
                    ui.ide.actions.ColibriCommands.registerCommands
                )
            );

            // editor inputs

            reg.addExtension(new colibri.ui.ide.FileEditorInputExtension());
        }
    }

    Platform.addPlugin(ColibriPlugin.getInstance());
}