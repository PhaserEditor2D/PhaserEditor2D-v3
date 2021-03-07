/// <reference path="./Plugin.ts" />
/// <reference path="./Platform.ts" />
/// <reference path="./ui/ide/Workbench.ts" />

namespace colibri {

    export const ICON_FILE = "file";
    export const ICON_FOLDER = "folder";
    export const ICON_PLUS = "plus";
    export const ICON_ZOOM_IN = "zoom_in";
    export const ICON_ZOOM_OUT = "zoom_out";
    export const ICON_MINUS = "minus";
    export const ICON_DELETE = "delete";
    export const ICON_ZOOM_RESET = "zoom-reset";
    export const ICON_MENU = "menu";
    export const ICON_SMALL_MENU = "small-menu";
    export const ICON_CHECKED = "checked";
    export const ICON_KEYMAP = "keymap";
    export const ICON_COLOR = "color";
    export const ICON_CONTROL_TREE_COLLAPSE = "tree-collapse";
    export const ICON_CONTROL_TREE_EXPAND = "tree-expand";
    export const ICON_CONTROL_TREE_EXPAND_LEFT = "tree-expand-left";
    export const ICON_CONTROL_TREE_COLLAPSE_LEFT = "tree-collapse-left";
    export const ICON_CONTROL_SECTION_COLLAPSE = "section-collapse";
    export const ICON_CONTROL_SECTION_EXPAND = "section-expand";
    export const ICON_CONTROL_CLOSE = "close";
    export const ICON_CONTROL_DIRTY = "dirty";

    export class ColibriPlugin extends colibri.Plugin {

        private static _instance;

        static getInstance(): ColibriPlugin {
            return this._instance ?? (this._instance = new ColibriPlugin());
        }

        private constructor() {
            super("colibri");
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            // theme icons

            reg.addExtension(
                colibri.ui.ide.IconLoaderExtension.withPluginFiles(this, [
                    ICON_KEYMAP,
                    ICON_CONTROL_DIRTY,
                    ICON_PLUS,
                    ICON_MINUS,
                    ICON_DELETE,
                    ICON_COLOR,
                    ICON_FILE,
                    ICON_FOLDER,
                    ICON_ZOOM_RESET,
                    ICON_ZOOM_IN,
                    ICON_ZOOM_OUT,
                    ICON_MENU,
                    ICON_SMALL_MENU,
                    ICON_CHECKED,
                    ICON_CONTROL_CLOSE,
                    ICON_CONTROL_TREE_COLLAPSE,
                    ICON_CONTROL_TREE_EXPAND,
                    ICON_CONTROL_TREE_EXPAND_LEFT,
                    ICON_CONTROL_TREE_COLLAPSE_LEFT,
                    ICON_CONTROL_SECTION_COLLAPSE,
                    ICON_CONTROL_SECTION_EXPAND,
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