namespace phasereditor2d.ide.ui.actions {

    import controls = colibri.ui.controls;

    export class PlayProjectAction extends controls.Action {

        constructor() {
            super({
                // text: "Play Project",
                icon: IDEPlugin.getInstance().getIcon(ICON_PLAY)
            });
        }

        run() {

            const url = colibri.ui.ide.FileUtils.getRoot().getUrl();

            controls.Controls.openUrlInNewPage(url);
        }
    }
}