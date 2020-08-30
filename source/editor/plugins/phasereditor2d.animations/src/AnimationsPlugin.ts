namespace phasereditor2d.animations {

    export class AnimationsPlugin extends colibri.Plugin {

        private static _instance: AnimationsPlugin;
        private _docs: ide.core.PhaserDocs;

        static getInstance() {

            return this._instance ?? (this._instance = new AnimationsPlugin());
        }

        constructor() {
            super("phasereditor2d.animations");

            this._docs = new phasereditor2d.ide.core.PhaserDocs(this, "data/phaser-docs.json");
        }

        getPhaserDocs() {

            return this._docs;
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            // preload docs

            reg.addExtension(new colibri.ui.ide.PluginResourceLoaderExtension(async () => {

                await this.getPhaserDocs().preload();
            }));


            // editors

            reg.addExtension(
                new colibri.ui.ide.EditorExtension([
                    ui.editors.AnimationsEditor.getFactory()
                ]));

            // commands

            reg.addExtension(new colibri.ui.ide.commands.CommandExtension(manager => {

                // // escape

                // manager.addHandlerHelper(colibri.ui.ide.actions.CMD_ESCAPE,
                //     args => args.activePart instanceof ui.editors.AnimationsEditor,
                //     args => args.activeEditor.setSelection([]));


                manager.addHandlerHelper(colibri.ui.ide.actions.CMD_DELETE,

                    args => (
                        args.activePart instanceof ui.editors.AnimationsEditor ||

                        (args.activeEditor instanceof ui.editors.AnimationsEditor &&
                            args.activePart instanceof outline.ui.views.OutlineView)

                    ) && args.activeEditor.getSelection().length > 0,

                    args => {
                        (args.activeEditor as ui.editors.AnimationsEditor).deleteSelected()
                    });

                // select all

                manager.addHandlerHelper(colibri.ui.ide.actions.CMD_SELECT_ALL,
                    args => args.activePart instanceof ui.editors.AnimationsEditor,
                    args => (args.activePart as ui.editors.AnimationsEditor).selectAll())
            }));
        }

        createAnimationsMetaData() {

            return {
                "app": "Phaser Editor 2D v3",
                "contentType": pack.core.contentTypes.CONTENT_TYPE_ANIMATIONS
            }
        }
    }

    colibri.Platform.addPlugin(AnimationsPlugin.getInstance());
}