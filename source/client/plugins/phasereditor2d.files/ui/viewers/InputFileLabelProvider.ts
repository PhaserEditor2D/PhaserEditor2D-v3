namespace phasereditor2d.files.ui.viewers {

    import controls = colibri.ui.controls;

    export class InputFileLabelProvider implements controls.viewers.ILabelProvider {

        getLabel(file: File): string {
            return file.name;
        }
    }
}