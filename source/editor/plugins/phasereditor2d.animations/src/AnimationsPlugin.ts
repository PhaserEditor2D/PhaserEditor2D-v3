namespace phasereditor2d.animations {

    export class AnimationsPlugin extends colibri.Plugin {

        private static _instance: AnimationsPlugin;

        static getInstance() {

            return this._instance ?? (this._instance = new AnimationsPlugin());
        }

        constructor() {
            super("phasereditor2d.animations");
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            reg.addExtension(
                new colibri.ui.ide.EditorExtension([
                    ui.editors.AnimationsEditor.getFactory()
                ]));

            reg.addExtension(new colibri.ui.ide.commands.CommandExtension(manager => {

                manager.addHandlerHelper(colibri.ui.ide.actions.CMD_ESCAPE,
                    args => args.activePart instanceof ui.editors.AnimationsEditor,
                    args => args.activeEditor.setSelection([]));

            }));
        }
    }

    colibri.Platform.addPlugin(AnimationsPlugin.getInstance());
}