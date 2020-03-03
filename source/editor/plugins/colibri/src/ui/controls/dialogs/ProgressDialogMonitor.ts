namespace colibri.ui.controls.dialogs {

    export class ProgressDialogMonitor implements IProgressMonitor {

        private _dialog: ProgressDialog;
        private _total: number;
        private _step: number;

        constructor(dialog: ProgressDialog) {

            this._dialog = dialog;

            this._total = 0;

            this._step = 0;
        }

        private updateDialog() {

            const p = this._step / this._total;

            this._dialog.setProgress(p);
        }

        addTotal(total: number) {

            this._total += total;

            this.updateDialog();
        }

        step() {

            this._step += 1;

            this.updateDialog();
        }
    }
}