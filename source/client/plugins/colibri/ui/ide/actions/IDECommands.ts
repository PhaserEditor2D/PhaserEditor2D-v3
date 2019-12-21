/// <reference path="../commands/KeyMatcher.ts" />

namespace colibri.ui.ide.actions {

    import KeyMatcher = commands.KeyMatcher;

    export const CMD_SAVE = "colibri.ui.ide.actions.Save";
    export const CMD_DELETE = "colibri.ui.ide.actions.Delete";
    export const CMD_RENAME = "colibri.ui.ide.actions.Rename";
    export const CMD_UNDO = "colibri.ui.ide.actions.Undo";
    export const CMD_REDO = "colibri.ui.ide.actions.Redo";
    export const CMD_COLLAPSE_ALL = "colibri.ui.ide.actions.CollapseAll";
    export const CMD_EXPAND_COLLAPSE_BRANCH = "colibri.ui.ide.actions.ExpandCollapseBranch";
    export const CMD_SELECT_ALL = "colibri.ui.ide.actions.SelectAll";
    export const CMD_ESCAPE = "colibri.ui.ide.actions.Scape";


    function isViewerScope(args: colibri.ui.ide.commands.CommandArgs) {

        if (args.activeElement) {

            const control = controls.Control.getControlOf(args.activeElement);

            if (control && control instanceof controls.viewers.Viewer) {
                return true;
            }
        }

        return false;
    }


    export class IDECommands {

        static registerCommands(manager: commands.CommandManager) {

            IDECommands.initEdit(manager);

            IDECommands.initUndo(manager);

            IDECommands.initViewer(manager);
        }

        private static initViewer(manager: commands.CommandManager) {

            // collapse all

            manager.addCommandHelper({
                id: CMD_COLLAPSE_ALL,
                name: "Collapse All",
                tooltip: "Collapse all elements"
            });

            manager.addHandlerHelper(CMD_COLLAPSE_ALL,
                isViewerScope,
                args => {
                    const viewer = <controls.viewers.Viewer>controls.Control.getControlOf(args.activeElement);
                    viewer.collapseAll();
                    viewer.repaint();
                }
            );

            manager.addKeyBinding(CMD_COLLAPSE_ALL, new KeyMatcher({
                key: "c"
            }));

            // select all

            manager.addCommandHelper({
                id: CMD_SELECT_ALL,
                name: "Select All",
                tooltip: "Select all elements"
            });

            manager.addHandlerHelper(CMD_SELECT_ALL,
                isViewerScope,
                args => {
                    const viewer = <controls.viewers.Viewer>controls.Control.getControlOf(args.activeElement);
                    viewer.selectAll();
                    viewer.repaint();
                }
            );

            manager.addKeyBinding(CMD_SELECT_ALL, new KeyMatcher({
                control: true,
                key: "a"
            }));

            // collapse expand branch

            manager.addCommandHelper({
                id: CMD_EXPAND_COLLAPSE_BRANCH,
                name: "Expand/Collapse the tree branch",
                tooltip: "Expand or collapse a branch of the select element"
            });

            manager.addHandlerHelper(CMD_EXPAND_COLLAPSE_BRANCH,
                args => args.activeElement !== null && controls.Control.getControlOf(args.activeElement) instanceof controls.viewers.Viewer,
                args => {
                    const viewer = <controls.viewers.Viewer>controls.Control.getControlOf(args.activeElement);

                    const parents = [];

                    for (const obj of viewer.getSelection()) {
                        const objParents = viewer.expandCollapseBranch(obj);
                        parents.push(...objParents);
                    }

                    viewer.setSelection(parents);
                }
            );

            manager.addKeyBinding(CMD_EXPAND_COLLAPSE_BRANCH, new KeyMatcher({
                key: " "
            }))


            // escape

            manager.addCommandHelper({
                id: CMD_ESCAPE,
                name: "Escape",
                tooltip: "Escape"
            });

            manager.addKeyBinding(CMD_ESCAPE, new KeyMatcher({
                key: "Escape"
            }));

            // clear viewer selection

            manager.addHandlerHelper(CMD_ESCAPE,
                isViewerScope,
                args => {
                    const viewer = <controls.viewers.Viewer>controls.Control.getControlOf(args.activeElement);
                    viewer.escape();
                }
            );

            // escape menu

            manager.addHandlerHelper(CMD_ESCAPE,
                args => args.activeMenu !== null,
                args => args.activeMenu.close()
            );
        }

        private static initUndo(manager: commands.CommandManager) {
            // undo

            manager.addCommandHelper({
                id: CMD_UNDO,
                name: "Undo",
                tooltip: "Undo operation"
            });

            manager.addHandlerHelper(CMD_UNDO,
                args => args.activePart !== null,
                args => args.activePart.getUndoManager().undo()
            );

            manager.addKeyBinding(CMD_UNDO, new KeyMatcher({
                control: true,
                key: "z"
            }));


            // redo

            manager.addCommandHelper({
                id: CMD_REDO,
                name: "Redo",
                tooltip: "Redo operation"
            });

            manager.addHandlerHelper(CMD_REDO,
                args => args.activePart !== null,
                args => args.activePart.getUndoManager().redo()

            );

            manager.addKeyBinding(CMD_REDO, new KeyMatcher({
                control: true,
                shift: true,
                key: "z"
            }));

        }

        private static initEdit(manager: commands.CommandManager) {

            // save

            manager.addCommandHelper({
                id: CMD_SAVE,
                name: "Save",
                tooltip: "Save"
            });

            manager.addHandlerHelper(CMD_SAVE,
                args => args.activeEditor ? true : false,
                args => {

                    if (args.activeEditor.isDirty()) {
                        args.activeEditor.save();
                    }
                }
            );

            manager.addKeyBinding(CMD_SAVE, new KeyMatcher({
                control: true,
                key: "s",
                filterInputElements: false
            }));

            // delete

            manager.addCommandHelper({
                id: CMD_DELETE,
                name: "Delete",
                tooltip: "Delete"
            });

            manager.addKeyBinding(CMD_DELETE, new KeyMatcher({
                key: "delete"
            }));

            // rename

            manager.addCommandHelper({
                id: CMD_RENAME,
                name: "Rename",
                tooltip: "Rename"
            });

            manager.addKeyBinding(CMD_RENAME, new KeyMatcher({
                key: "f2"
            }));
        }

    }

}