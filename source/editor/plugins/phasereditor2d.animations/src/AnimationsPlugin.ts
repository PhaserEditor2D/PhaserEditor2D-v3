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
        }
    }

    colibri.Platform.addPlugin(AnimationsPlugin.getInstance());
}