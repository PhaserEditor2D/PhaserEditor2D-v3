namespace colibri.ui.controls.dialogs {

    export class WizardPage {

        private _title: string;
        private _description: string;
        private _wizard: WizardDialog;

        constructor(title: string, description: string) {

            this._title = title;
            this._description = description;
        }

        getWizard() {

            return this._wizard;
        }

        setWizard(wizard: WizardDialog) {

            this._wizard = wizard;
        }

        getDescription() {

            return this._description;
        }

        setDescription(description: string) {

            this._description = description;
        }

        getTitle() {

            return this._title;
        }

        setTitle(title: string) {

            this._title = title;
        }

        createElements(parent: HTMLElement) {
            // nothing
        }

        canFinish() {

            return true;
        }

        canGoNext() {

            return true;
        }

        canGoBack() {

            return true;
        }

        saveState() {
            // nothing
        }
    }
}