namespace colibri.ui.controls.viewers {

    export class PreloadCellArgs {

        constructor(
            public obj: any,
            public viewer: Viewer) {
        }

        clone() {
            return new PreloadCellArgs(this.obj, this.viewer);
        }
    }
}