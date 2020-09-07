namespace phasereditor2d.animations {

    export const CAT_ANIMATIONS = "phasereditor2d.animations.AnimationsCategory";
    export const CMD_ADD_ANIMATION = "phasereditor2d.animations.AddAnimations";
    export const CMD_APPEND_FRAMES = "phasereditor2d.animations.AppendFrames";
    export const CMD_PREPEND_FRAMES = "phasereditor2d.animations.PrependFrames";

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

            // new file wizards

            reg.addExtension(new ui.dialogs.NewAnimationsFileExtension());

            // commands

            reg.addExtension(
                new colibri.ui.ide.commands.CommandExtension(manager => this.registerCommands(manager))
            );
        }

        private registerCommands(manager: colibri.ui.ide.commands.CommandManager) {

            const editorContext = (args: colibri.ui.ide.commands.HandlerArgs) =>
                args.activePart instanceof ui.editors.AnimationsEditor ||
                (args.activeEditor instanceof ui.editors.AnimationsEditor &&
                    args.activePart instanceof outline.ui.views.OutlineView);

            manager.addCategory({
                id: CAT_ANIMATIONS,
                name: "Sprite Animation"
            });

            // escape

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_ESCAPE,
                args => args.activePart instanceof ui.editors.AnimationsEditor,
                args => args.activeEditor.setSelection([]));

            // delete

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_DELETE,

                args => editorContext(args) && args.activeEditor.getSelection().length > 0,

                args => {
                    (args.activeEditor as ui.editors.AnimationsEditor).deleteSelected()
                });

            // select all

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_SELECT_ALL,
                editorContext,
                args => (args.activePart as ui.editors.AnimationsEditor).selectAll());

            // add animation

            manager.add({
                command: {
                    id: CMD_ADD_ANIMATION,
                    category: CAT_ANIMATIONS,
                    name: "Add Animation",
                    tooltip: "Add a new animation",
                    icon: colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_PLUS)
                },
                handler: {
                    testFunc: editorContext,
                    executeFunc: args => {
                        (args.activeEditor as ui.editors.AnimationsEditor).openAddAnimationDialog();
                    }
                },
                keys: {
                    key: "A"
                }
            });

            // add frames

            const testAppendFrames = (args: colibri.ui.ide.commands.HandlerArgs) =>
                editorContext(args)
                && args.activeEditor.getSelection().length === 1
                && args.activeEditor.getSelection()[0] instanceof Phaser.Animations.Animation;

            manager.add({
                command: {
                    id: CMD_PREPEND_FRAMES,
                    name: "Prepend Frames",
                    category: CAT_ANIMATIONS,
                    tooltip: "Prepend frames to the selected animation."
                },
                handler: {
                    testFunc: testAppendFrames,
                    executeFunc: args => (args.activeEditor as ui.editors.AnimationsEditor).openAddFramesDialog("prepend")
                }
            });

            manager.add({
                command: {
                    id: CMD_APPEND_FRAMES,
                    name: "Append Frames",
                    category: CAT_ANIMATIONS,
                    tooltip: "Append frames to the selected animation."
                },
                handler: {
                    testFunc: testAppendFrames,
                    executeFunc: args => (args.activeEditor as ui.editors.AnimationsEditor).openAddFramesDialog("append")
                }
            });
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