namespace phasereditor2d.ide.ui.dialogs {

    import controls = colibri.ui.controls;

    export class OpeningProjectDialog extends controls.dialogs.ProgressDialog {

        create() {

            super.create();

            this.setTitle("Opening project");
            
            this.setProgress(0);

            this.getDialogBackgroundElement().classList.add("DarkDialogContainer");
        }
    }
}