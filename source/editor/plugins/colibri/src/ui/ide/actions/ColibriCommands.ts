/// <reference path="../commands/KeyMatcher.ts" />

namespace colibri.ui.ide.actions {

    import KeyMatcher = commands.KeyMatcher;

    export const CAT_GENERAL = "colibri.ui.ide.actions.GeneralCategory";
    export const CAT_EDIT = "colibri.ui.ide.actions.EditCategory";
    export const CMD_SAVE = "colibri.ui.ide.actions.Save";
    export const CMD_SAVE_ALL = "colibri.ui.ide.actions.SaveAll";
    export const CMD_EDITOR_TABS_SIZE_UP = "colibri.ui.ide.actions.EditorTabsSizeUp";
    export const CMD_EDITOR_TABS_SIZE_DOWN = "colibri.ui.ide.actions.EditorTabsSizeDown";
    export const CMD_EDITOR_CLOSE = "colibri.ui.ide.actions.EditorClose";
    export const CMD_EDITOR_CLOSE_ALL = "colibri.ui.ide.actions.EditorCloseAll";
    export const CMD_DELETE = "colibri.ui.ide.actions.Delete";
    export const CMD_RENAME = "colibri.ui.ide.actions.Rename";
    export const CMD_UNDO = "colibri.ui.ide.actions.Undo";
    export const CMD_REDO = "colibri.ui.ide.actions.Redo";
    export const CMD_COLLAPSE_ALL = "colibri.ui.ide.actions.CollapseAll";
    export const CMD_EXPAND_COLLAPSE_BRANCH = "colibri.ui.ide.actions.ExpandCollapseBranch";
    export const CMD_SELECT_ALL = "colibri.ui.ide.actions.SelectAll";
    export const CMD_ESCAPE = "colibri.ui.ide.actions.Escape";
    export const CMD_UPDATE_CURRENT_EDITOR = "colibri.ui.ide.actions.UpdateCurrentEditor";
    export const CMD_SHOW_COMMAND_PALETTE = "colibri.ui.ide.actions.ShowCommandPalette";
    export const CMD_COPY = "colibri.ui.ide.actions.Copy";
    export const CMD_CUT = "colibri.ui.ide.actions.Cut";
    export const CMD_PASTE = "colibri.ui.ide.actions.Paste";
    export const CMD_SHOW_COMMENT_DIALOG = "colibri.ui.ide.actions.ShowCommentDialog";
    export const CMD_CHANGE_THEME = "phasereditor2d.ide.ui.actions.SwitchTheme";
    export const CMD_INCR_CANVAS_FONT_HEIGHT = "phasereditor2d.ide.ui.actions.IncrementCanvasFontHeight";
    export const CMD_DECR_CANVAS_FONT_HEIGHT = "phasereditor2d.ide.ui.actions.DecrementCanvasFontHeight";
    export const CMD_RESET_CANVAS_FONT_HEIGHT = "phasereditor2d.ide.ui.actions.ResetCanvasFontHeight";

    function isViewerScope(args: colibri.ui.ide.commands.HandlerArgs) {

        return getViewer(args) !== null;
    }

    function getViewer(args: colibri.ui.ide.commands.HandlerArgs): controls.viewers.TreeViewer {

        if (args.activeElement) {

            let control = controls.Control.getParentControl(args.activeElement);

            if (control instanceof controls.viewers.FilterControl) {

                control = control.getFilteredViewer().getViewer();
            }

            if (control && control instanceof controls.viewers.Viewer) {

                return control as controls.viewers.TreeViewer;
            }
        }

        return null;
    }

    export class ColibriCommands {

        static registerCommands(manager: commands.CommandManager) {

            manager.addCategory({
                id: CAT_GENERAL,
                name: "General"
            });

            manager.addCategory({
                id: CAT_EDIT,
                name: "Edit"
            });

            ColibriCommands.initEditors(manager);

            ColibriCommands.initEdit(manager);

            ColibriCommands.initUndo(manager);

            ColibriCommands.initViewer(manager);

            ColibriCommands.initPalette(manager);

            ColibriCommands.initCommentDialog(manager);

            ColibriCommands.initTheme(manager);

            ColibriCommands.initFontSize(manager);
        }

        static initFontSize(manager: commands.CommandManager) {

            manager.add({
                command: {
                    id: CMD_INCR_CANVAS_FONT_HEIGHT,
                    category: CAT_GENERAL,
                    name: "Increment Viewer Font Size",
                    tooltip: "Increments the font size of viewers"
                },
                handler: {
                    executeFunc: args => {

                        controls.incrementFontHeight(1);
                    }
                }
            });

            manager.add({
                command: {
                    id: CMD_DECR_CANVAS_FONT_HEIGHT,
                    category: CAT_GENERAL,
                    name: "Decrement Viewer Font Size",
                    tooltip: "Decrement the font size of viewers"
                },
                handler: {
                    executeFunc: args => {

                        controls.incrementFontHeight(-1);
                    }
                }
            });

            manager.add({
                command: {
                    id: CMD_RESET_CANVAS_FONT_HEIGHT,
                    category: CAT_GENERAL,
                    name: "Reset Viewer Font Size",
                    tooltip: "Reset the font size of viewers"
                },
                handler: {
                    executeFunc: args => {

                        controls.resetFontHeight();
                    }
                }
            });
        }

        private static initTheme(manager: commands.CommandManager) {

            // theme dialog

            manager.add({
                command: {
                    id: CMD_CHANGE_THEME,
                    name: "Select Color Theme",
                    tooltip: "Select the color theme of the IDE.",
                    category: CAT_GENERAL
                },
                handler: {
                    executeFunc: args => {
                        const dlg = new ui.controls.dialogs.ThemesDialog();

                        dlg.create();

                        dlg.getViewer().setSelection([controls.Controls.getTheme()]);

                        dlg.getViewer().eventSelectionChanged.addListener(() => {

                            const theme = dlg.getViewer().getSelectionFirstElement() as controls.ITheme;

                            if (theme) {

                                ui.controls.Controls.setTheme(theme);
                            }
                        });
                    },
                    testFunc: args => !(args.activeDialog instanceof controls.dialogs.ThemesDialog)
                },
                keys: {
                    control: true,
                    key: "Digit2",
                    keyLabel: "2",
                    filterInputElements: false
                }
            })
        }

        private static initCommentDialog(manager: commands.CommandManager) {

            manager.add({
                command: {
                    id: CMD_SHOW_COMMENT_DIALOG,
                    name: "Open Comment Dialog",
                    category: CAT_GENERAL,
                    tooltip: "Open a comment dialog to write texts in presentations or screen-recording videos."
                },
                handler: {
                    executeFunc: () => {
                        const dlg = new controls.dialogs.CommentDialog();
                        dlg.create();
                    }
                },
                keys: {
                    control: true,
                    alt: true,
                    key: "Space"
                }
            });
        }

        private static initPalette(manager: commands.CommandManager) {

            manager.add({
                command: {
                    id: CMD_SHOW_COMMAND_PALETTE,
                    name: "Command Palette",
                    tooltip: "Show a dialog with the list of commands active in that context.",
                    category: CAT_GENERAL
                },
                handler: {
                    executeFunc: args => {

                        const dlg = new controls.dialogs.CommandDialog();
                        dlg.create();
                    }
                },
                keys: {
                    control: true,
                    key: "KeyK"
                }
            });
        }

        private static initEditors(manager: commands.CommandManager) {

            // editor tabs size

            manager.addCommandHelper({
                id: CMD_EDITOR_TABS_SIZE_DOWN,
                name: "Decrement Tab Size",
                tooltip: "Make bigger the editor tabs.",
                category: CAT_GENERAL
            });

            manager.addCommandHelper({
                id: CMD_EDITOR_TABS_SIZE_UP,
                name: "Increment Tab Size",
                tooltip: "Make smaller the editor tabs.",
                category: CAT_GENERAL
            });

            manager.addHandlerHelper(CMD_EDITOR_TABS_SIZE_DOWN,
                e => true,
                args =>
                    colibri.Platform.getWorkbench().getActiveWindow().getEditorArea().incrementTabIconSize(-5)
            );

            manager.addHandlerHelper(CMD_EDITOR_TABS_SIZE_UP,
                e => true,
                args =>
                    colibri.Platform.getWorkbench().getActiveWindow().getEditorArea().incrementTabIconSize(5)
            );

            manager.addKeyBinding(CMD_EDITOR_TABS_SIZE_DOWN, new commands.KeyMatcher({
                control: true,
                key: "Digit3",
                keyLabel: "3",
            }));

            manager.addKeyBinding(CMD_EDITOR_TABS_SIZE_UP, new commands.KeyMatcher({
                control: true,
                key: "Digit4",
                keyLabel: "4",
            }));

            // close editor

            manager.addCommandHelper({
                id: CMD_EDITOR_CLOSE,
                name: "Close Editor",
                tooltip: "Close active editor.",
                category: CAT_GENERAL
            });

            manager.addHandlerHelper(CMD_EDITOR_CLOSE,
                args => typeof args.activeEditor === "object",
                args => Platform.getWorkbench().getActiveWindow().getEditorArea().closeTab(args.activeEditor));

            manager.addKeyBinding(CMD_EDITOR_CLOSE, new KeyMatcher({
                control: true,
                key: "KeyQ"
            }));

            // close all editors

            manager.addCommandHelper({
                id: CMD_EDITOR_CLOSE_ALL,
                name: "Close All Editors",
                tooltip: "Close all editors.",
                category: CAT_GENERAL
            });

            manager.addHandlerHelper(CMD_EDITOR_CLOSE_ALL,
                args => true,
                args => Platform.getWorkbench().getActiveWindow().getEditorArea().closeAllEditors());

            manager.addKeyBinding(CMD_EDITOR_CLOSE_ALL, new KeyMatcher({
                control: true,
                shift: true,
                key: "KeyQ"
            }));
        }

        private static initViewer(manager: commands.CommandManager) {

            // collapse all

            manager.add({
                command: {
                    id: CMD_COLLAPSE_ALL,
                    name: "Collapse All",
                    tooltip: "Collapse all elements",
                    category: CAT_GENERAL
                },
                handler: {
                    testFunc: isViewerScope,
                    executeFunc: args => {
                        const viewer = getViewer(args);
                        viewer.collapseAll();
                        viewer.repaint();
                    }
                },
                keys: {
                    key: "KeyC"
                }
            })

            // select all

            manager.addCommandHelper({
                id: CMD_SELECT_ALL,
                name: "Select All",
                tooltip: "Select all elements",
                category: CAT_GENERAL
            });

            manager.addHandlerHelper(CMD_SELECT_ALL,
                isViewerScope,
                args => {
                    const viewer = getViewer(args);
                    viewer.selectAll();
                    viewer.repaint();
                }
            );

            manager.addKeyBinding(CMD_SELECT_ALL, new KeyMatcher({
                control: true,
                key: "KeyA"
            }));

            // collapse expand branch

            manager.add({
                command: {
                    id: CMD_EXPAND_COLLAPSE_BRANCH,
                    name: "Expand/Collapse Branch",
                    tooltip: "Expand or collapse a branch of the select element",
                    category: CAT_GENERAL
                },
                handler: {
                    testFunc: isViewerScope,

                    executeFunc: args => {

                        const viewer = getViewer(args);

                        viewer.expandCollapseBranch();
                    }
                },
                keys: {
                    key: "Space"
                }
            })

            // escape

            manager.addCommandHelper({
                id: CMD_ESCAPE,
                name: "Escape",
                tooltip: "Escape",
                category: CAT_GENERAL
            });

            manager.addKeyBinding(CMD_ESCAPE, new KeyMatcher({
                key: "Escape"
            }));

            // clear viewer selection

            manager.addHandlerHelper(CMD_ESCAPE,
                isViewerScope,
                args => {
                    const viewer = getViewer(args);
                    viewer.escape();
                }
            );

            // escape menu

            manager.addHandlerHelper(CMD_ESCAPE,
                args => args.activeMenu !== null && args.activeMenu !== undefined,
                args => args.activeMenu.closeAll()
            );
        }

        private static initUndo(manager: commands.CommandManager) {
            // undo

            manager.addCommandHelper({
                id: CMD_UNDO,
                name: "Undo",
                tooltip: "Undo operation",
                category: CAT_GENERAL
            });

            manager.addHandlerHelper(CMD_UNDO,
                args => args.activePart !== null,
                args => args.activePart.getUndoManager().undo()
            );

            manager.addKeyBinding(CMD_UNDO, new KeyMatcher({
                control: true,
                key: "KeyZ"
            }));

            // redo

            manager.addCommandHelper({
                id: CMD_REDO,
                name: "Redo",
                tooltip: "Redo operation",
                category: CAT_GENERAL
            });

            manager.addHandlerHelper(CMD_REDO,
                args => args.activePart !== null,
                args => args.activePart.getUndoManager().redo()

            );

            manager.addKeyBinding(CMD_REDO, new KeyMatcher({
                control: true,
                shift: true,
                key: "KeyZ"
            }));

            // update current editor

            manager.addCommandHelper({
                id: CMD_UPDATE_CURRENT_EDITOR,
                name: "Update Current Editor",
                tooltip: "Refresh the current editor's content.",
                category: CAT_EDIT
            });
        }

        private static initEdit(manager: commands.CommandManager) {

            // save

            manager.add({
                command: {
                    id: CMD_SAVE,
                    name: "Save",
                    tooltip: "Save",
                    category: CAT_EDIT
                },
                handler: {
                    testFunc: args => {

                        return args.activeEditor ? true : false;
                    },
                    executeFunc: args => {

                        if (args.activeEditor.isDirty()) {

                            args.activeEditor.save();
                        }
                    }
                },
                keys: {
                    control: true,
                    key: "KeyS",
                    filterInputElements: false
                }
            });

            // save all

            manager.add({
                command: {
                    id: CMD_SAVE_ALL,
                    name: "Save All",
                    tooltip: "Save all editors",
                    category: CAT_EDIT
                },
                handler: {
                    testFunc: args => {

                        const editors = Platform.getWorkbench().getActiveWindow().getEditorArea().getEditors();

                        return editors.some(e => e.isDirty() && !e.isReadOnly());
                    },
                    executeFunc: args => {

                        Platform.getWorkbench().saveAllEditors();
                    }
                }
            });

            // delete

            manager.addCommandHelper({
                id: CMD_DELETE,
                name: "Delete",
                tooltip: "Delete",
                category: CAT_EDIT
            });

            manager.addKeyBinding(CMD_DELETE, new KeyMatcher({
                key: "Delete"
            }));

            manager.addKeyBinding(CMD_DELETE, new KeyMatcher({
                key: "Backspace"
            }));

            // rename

            manager.addCommandHelper({
                id: CMD_RENAME,
                name: "Rename",
                tooltip: "Rename",
                category: CAT_EDIT
            });

            manager.addKeyBinding(CMD_RENAME, new KeyMatcher({
                key: "F2"
            }));

            // copy/cut/paste

            manager.add({
                command: {
                    id: CMD_COPY,
                    name: "Copy",
                    tooltip: "Copy selected objects.",
                    category: CAT_EDIT
                },
                keys: {
                    control: true,
                    key: "KeyC"
                }
            });

            manager.add({
                command: {
                    id: CMD_CUT,
                    name: "Cut",
                    tooltip: "Cut selected objects.",
                    category: CAT_EDIT
                },
                keys: {
                    control: true,
                    key: "KeyX"
                }
            });

            manager.add({
                command: {
                    id: CMD_PASTE,
                    name: "Paste",
                    tooltip: "Paste clipboard content.",
                    category: CAT_EDIT
                },
                keys: {
                    control: true,
                    key: "KeyV"
                }
            });
        }
    }
}
