namespace phasereditor2d.animations.ui.editors {

    import controls = colibri.ui.controls;

    export class AnimationsEditorMenuCreator {

        private _editor: AnimationsEditor;

        constructor(editor: AnimationsEditor) {

            this._editor = editor;
        }

        fillMenu(menu: controls.Menu) {

            menu.addCommand(CMD_ADD_ANIMATION);
            menu.addSeparator();
            menu.addCommand(CMD_PREPEND_FRAMES);
            menu.addCommand(CMD_APPEND_FRAMES);
            menu.addSeparator();
            menu.addCommand(colibri.ui.ide.actions.CMD_SELECT_ALL);
            menu.addCommand(colibri.ui.ide.actions.CMD_UNDO);
            menu.addCommand(colibri.ui.ide.actions.CMD_REDO);
            menu.addSeparator();
            menu.addCommand(colibri.ui.ide.actions.CMD_DELETE);
        }
    }
}