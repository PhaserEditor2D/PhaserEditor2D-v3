namespace colibri.ui.controls {

    export interface IProgressMonitor {

        addTotal(total: number);

        step();
    }
}